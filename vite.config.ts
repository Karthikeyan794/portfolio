import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// PORT is set by the preview tool when it assigns a free port; default to 5173 otherwise.
const port = Number(process.env.PORT) || 5173

/**
 * `npm run dev` answers /api/ask with the same function Vercel runs
 * (api/ask.ts), so the "Ask about me" chat works locally. The key comes from
 * .env.local (git-ignored), as it does from Vercel's settings once deployed.
 */
function askDev(): Plugin {
  return {
    name: 'ask-dev',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      for (const k of ['GEMINI_API_KEY', 'GEMINI_MODEL']) if (env[k] && !process.env[k]) process.env[k] = env[k]
      server.middlewares.use('/api/ask', async (req, res) => {
        try {
          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          const request = new Request(`http://${req.headers.host}/api/ask`, {
            method: req.method,
            headers,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          })
          const mod = await server.ssrLoadModule('/api/ask.ts')
          const response: Response = await mod.default.fetch(request)
          res.statusCode = response.status
          response.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          server.config.logger.error(`ask-dev: ${(e as Error).message}`)
          res.statusCode = 500
          res.end('{"error":"offline"}')
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), askDev()],
  server: { port },
})
