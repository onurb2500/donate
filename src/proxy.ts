import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";

const PUBLIC_API_PATHS = ["/api/auth/register", "/api/auth/login"];
const PUBLIC_PAGES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PAGES.includes(pathname) ||
    PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.userId && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session.userId && PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
