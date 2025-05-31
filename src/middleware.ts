import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const response = NextResponse.next();
    return response;
}

export const config = {
    matcher: ["/api/:path*"],
};
