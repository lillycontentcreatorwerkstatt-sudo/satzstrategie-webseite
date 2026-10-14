import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Config redirects match without case sensitivity; doing this there would
  // also redirect /kontakt to itself. Keep the canonical URL loop-free.
  if (request.nextUrl.pathname === "/Kontakt") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/kontakt";
    return NextResponse.redirect(destination, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: "/Kontakt" };
