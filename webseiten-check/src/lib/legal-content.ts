import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

export function readLegacyLegalContent(fileName: "impressum.html" | "datenschutz.html", selector: string): string {
  const sourcePath = join(process.cwd(), "..", fileName);
  const source = readFileSync(sourcePath, "utf8");
  const $ = cheerio.load(source);
  $(selector).find("script").remove();
  const content = $(selector).html();
  if (!content) throw new Error(`Rechtstext konnte nicht aus ${fileName} gelesen werden.`);
  return content;
}
