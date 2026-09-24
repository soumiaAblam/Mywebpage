export interface Env {
  ASSETS: Fetcher;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === '/api/login' && request.method === 'POST') {
      if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
        return new Response('Admin access is not configured.', { status: 503 });
      }
      const credentials = await request.json<{ email?: string; password?: string }>();
      if (credentials.email !== env.ADMIN_EMAIL || credentials.password !== env.ADMIN_PASSWORD) {
        return new Response('Invalid credentials.', { status: 401 });
      }
      return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
