import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Webhook endpoint for Notion on-demand revalidation.
 *
 * When a Notion automation or third-party service sends a webhook,
 * this endpoint verifies the request and triggers revalidation of
 * the homepage and /news archive so fresh data is fetched from Notion.
 *
 * Authentication:
 *   - Uses the `verification_token` from Notion's webhook subscription.
 *   - The token is stored as NOTION_WEBHOOK_SECRET in environment variables.
 *   - Incoming requests must include an `X-Notion-Signature` header
 *     containing `sha256=<HMAC-SHA256 of request body>`.
 *   - The HMAC is computed using the verification_token as the secret key.
 *
 * Flow:
 *   1. Webhook fires when a page in the News database is updated.
 *   2. This endpoint verifies the signature.
 *   3. On success, it calls revalidatePath() for `/` and `/news`.
 *   4. The next request to those pages triggers a fresh Notion API fetch.
 *
 * Note: This endpoint does NOT read the webhook payload to extract
 * specific page data. It simply uses the event as a signal to
 * re-fetch all news from Notion via the existing query logic.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.NOTION_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 404 }
    );
  }

  const signature = request.headers.get("x-notion-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 401 }
    );
  }

  const body = await request.text();
  const expectedSig =
    "sha256=" + createHmac("sha256", secret).update(body).digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  // Revalidate pages — next request will re-fetch from Notion
  revalidatePath("/", "page");
  revalidatePath("/news", "page");

  return NextResponse.json({ revalidated: true });
}
