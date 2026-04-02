import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactBody>;

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Contact Form <hello@tsuchiyatakahiro.com>",
      to: ["hello@tsuchiyatakahiro.com"],
      replyTo: body.email,
      subject: `[tsuchiyatakahiro.com] Message from ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\n${body.message}`,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
