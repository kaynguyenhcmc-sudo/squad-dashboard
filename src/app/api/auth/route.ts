import { NextRequest, NextResponse } from "next/server";

// Set your password here - you can also use environment variable
const SITE_PASSWORD = process.env.SITE_PASSWORD || "7Ak2Xp5O3N";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === SITE_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set auth cookie - session only (expires when browser closes)
      response.cookies.set("site_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // No maxAge = session cookie (deleted when browser closes)
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("site_auth");
  return response;
}

