import isUrl from 'is-url';

export interface Env {
  LINKS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);

    if (!path) return new Response('Missing redirect slug', { status: 404 });

    const redirectUrl = await env.LINKS.get(path);

    if (redirectUrl === null) return new Response('Unknown redirect', { status: 404 });
    if (!isUrl(redirectUrl)) return new Response('Invalid redirect URL', { status: 500 });

    return Response.redirect(redirectUrl, 301);
  },
};
