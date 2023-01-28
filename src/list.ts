import { countryCodeEmoji } from 'country-code-emoji';
import { RedirectLink } from './index';

export async function listUrls(db: D1Database, cf: any): Promise<string> {
  const { results: listedLinks }: D1Result<RedirectLink> = await db
    .prepare(`SELECT slug, url, uses FROM links WHERE unlisted = 0;`)
    .all();
  const emoji = countryCodeEmoji(cf?.country);

  return `
  <!doctype html>
  <html>
    <head>
      <title>Redirect Link Summary</title>
      <style>
        body {
          font-family: sans-serif;
      </style>
    </head>
    ${
      listedLinks
        ? `Hi${emoji ? ` from ${emoji}` : ''}!\n<ul>\n` +
          listedLinks
            ?.map((link) => `<li>${link.slug} -> ${link.url} (${link.uses} uses)</li>`)
            .join('\n') +
          '</ul>'
        : '<i>No links found</i>'
    }
  </html>
  `;
}
