import { countryCodeEmoji } from 'country-code-emoji';
import { RedirectLink } from './index';

const template = (title: string = 'foo', body: string) => `
  <!doctype html>
  <html>
    <head>
      <title>Redirect Link Summary</title>
      <style>
        body {
          font-family: sans-serif;
      </style>
    </head>
    <body>
      ${body}
    </body>
  </html>
`;

function hello(country: string) {
  const emoji = countryCodeEmoji(country);

  return `Hi${emoji ? ` from ${emoji}` : ''}!`;
}

export const homePage = (cf: any) =>
  template(
    'URL Shortener',
    `${hello(
      cf.country
    )}\nQuick Cloudflare <a href="https://github.com/jschuur/edge-redirect">URL shortener</a> by <a href="https://joostschuur.com">Joost Schuur</a> (<a href="https://twitter.com/joostschuur">@joostschuur</a>).`
  );

export async function summaryPage(db: D1Database, cf: any): Promise<string> {
  const { results: listedLinks }: D1Result<RedirectLink> = await db
    .prepare(`SELECT slug, url, uses FROM links WHERE unlisted = 0;`)
    .all();
  const emoji = countryCodeEmoji(cf?.country);

  return template(
    `Redirect Link Summary`,
    `
    ${
      listedLinks
        ? `${hello(cf.country)}\n<ul>\n` +
          listedLinks
            ?.map((link) => `<li>${link.slug} -> ${link.url} (${link.uses} uses)</li>`)
            .join('\n') +
          '</ul>'
        : '<i>No links found</i>'
    }
  `
  );
}
