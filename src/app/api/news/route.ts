import { NextRequest, NextResponse } from "next/server";
import { fetchHomeNews, fetchAllNews } from "@/lib/notion";

export const revalidate = 300; // revalidate every 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get("mode");

  try {
    const items = mode === "all" ? await fetchAllNews() : await fetchHomeNews();
    return NextResponse.json({ success: true, data: items });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch news";
    const isConfig = message.includes("not configured");

    return NextResponse.json(
      {
        success: false,
        data: [],
        error: isConfig
          ? "News feed is not configured yet."
          : "Unable to load news at this time.",
      },
      { status: isConfig ? 503 : 500 }
    );
  }
}
