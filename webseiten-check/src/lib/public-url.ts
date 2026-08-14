import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { HTTPRequest, Page } from "puppeteer-core";

const ALLOWED_PORTS = new Set(["", "80", "443"]);
const BLOCKED_HOST_SUFFIXES = [".local", ".localhost", ".internal", ".home", ".lan"];

export class PublicUrlError extends Error {}

function isBlockedIpv4(address: string): boolean {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return true;
  }

  const [a, b, c] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

function isBlockedIpv6(address: string): boolean {
  const normalized = address.toLowerCase().split("%")[0];
  if (normalized === "::" || normalized === "::1") return true;

  const mappedIpv4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mappedIpv4) return isBlockedIpv4(mappedIpv4);
  if (normalized.startsWith("::ffff:")) return true;

  const firstGroup = Number.parseInt(normalized.split(":")[0] || "0", 16);
  return (
    (firstGroup & 0xfe00) === 0xfc00 ||
    (firstGroup & 0xffc0) === 0xfe80 ||
    (firstGroup & 0xff00) === 0xff00 ||
    normalized.startsWith("2001:db8:")
  );
}

function isBlockedAddress(address: string): boolean {
  const version = isIP(address);
  if (version === 4) return isBlockedIpv4(address);
  if (version === 6) return isBlockedIpv6(address);
  return true;
}

function assertAllowedUrlShape(url: URL): void {
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new PublicUrlError("Es sind nur HTTP- und HTTPS-Webseiten erlaubt.");
  }
  if (url.username || url.password) {
    throw new PublicUrlError("Webadressen mit Zugangsdaten werden nicht unterstützt.");
  }
  if (!ALLOWED_PORTS.has(url.port)) {
    throw new PublicUrlError("Die Webseite muss über Port 80 oder 443 erreichbar sein.");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    hostname === "localhost" ||
    BLOCKED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  ) {
    throw new PublicUrlError("Lokale oder interne Webadressen können nicht analysiert werden.");
  }
}

export async function parseAndValidatePublicUrl(rawUrl: string): Promise<URL> {
  const value = rawUrl.trim();
  if (!value || value.length > 2_048) {
    throw new PublicUrlError("Bitte gib eine gültige Webadresse ein.");
  }

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    throw new PublicUrlError("Bitte gib eine gültige Webadresse ein.");
  }

  assertAllowedUrlShape(url);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  let addresses: Array<{ address: string }>;
  try {
    addresses = isIP(hostname)
      ? [{ address: hostname }]
      : await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new PublicUrlError("Die Domain konnte nicht aufgelöst werden.");
  }

  if (addresses.length === 0 || addresses.some(({ address }) => isBlockedAddress(address))) {
    throw new PublicUrlError("Lokale oder interne Webadressen können nicht analysiert werden.");
  }

  return url;
}

export async function enablePublicNetworkOnly(page: Page): Promise<void> {
  const approvedHosts = new Map<string, Promise<URL>>();
  await page.setRequestInterception(true);

  page.on("request", (interceptedRequest: HTTPRequest) => {
    void (async () => {
      const resourceUrl = interceptedRequest.url();
      if (!resourceUrl.startsWith("http://") && !resourceUrl.startsWith("https://")) {
        await interceptedRequest.continue();
        return;
      }

      const parsed = new URL(resourceUrl);
      const cacheKey = `${parsed.protocol}//${parsed.hostname}:${parsed.port}`;
      const validation = approvedHosts.get(cacheKey) ?? parseAndValidatePublicUrl(resourceUrl);
      approvedHosts.set(cacheKey, validation);
      await validation;
      await interceptedRequest.continue();
    })().catch(async () => {
      try {
        await interceptedRequest.abort("blockedbyclient");
      } catch {
        // Die Anfrage kann bereits beendet worden sein.
      }
    });
  });
}
