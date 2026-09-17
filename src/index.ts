export interface Env {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Sirve los archivos estáticos de la carpeta /public (HTML, CSS, foto)
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
