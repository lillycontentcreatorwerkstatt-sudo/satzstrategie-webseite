import { NextResponse, type NextRequest } from "next/server";

// Seiten der alten Webseite ohne Nachfolger: 410 sagt Suchmaschinen, dass sie dauerhaft entfernt sind.
const removedPages = ["/kippl.html", "/login.html", "/shop.html"];

export function proxy(request: NextRequest) {
  if (removedPages.includes(request.nextUrl.pathname)) {
    return new NextResponse('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Seite entfernt | Satzstrategie</title><p>Diese Seite gibt es nicht mehr. <a href="/">Zur Startseite von Satzstrategie</a></p></html>', { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
  // Config redirects match without case sensitivity; doing this there would
  // also redirect /kontakt to itself. Keep the canonical URL loop-free.
  if (request.nextUrl.pathname === "/Kontakt") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/kontakt";
    return NextResponse.redirect(destination, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/Kontakt", "/kippl.html", "/login.html", "/shop.html"] };
