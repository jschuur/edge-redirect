import isUrl from 'is-url';

import { listUrls } from './list';

export interface Env {
  // LINKS: KVNamespace;
  DB: D1Database;
}

export interface RedirectLink {
  slug: string;
  url: string;
  uses: number;
  unlisted: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const db = env.DB;

    const url = new URL(request.url);
    const slug = url.pathname.slice(1);

    console.log({ slug });
    if (slug === '@list')
      return new Response(await listUrls(db, request.cf), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });

    if (!slug) return new Response('Missing redirect slug', { status: 404 });

    // const redirectUrl = await env.LINKS.get(path);
    const result: RedirectLink = await db
      .prepare(`SELECT url FROM links WHERE slug = ?1;`)
      .bind(slug)
      .first();

    if (!result) return new Response(`Unknown redirect slug '${slug}'`, { status: 404 });

    const redirectUrl = result.url;
    await db.prepare(`UPDATE links SET uses = uses + 1 WHERE slug = ?1;`).bind(slug).run();

    if (!isUrl(redirectUrl)) return new Response('Invalid redirect URL', { status: 500 });

    return Response.redirect(redirectUrl, 301);
  },
};
