import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const TMDB_BASE = 'https://api.themoviedb.org/3'

function tmdbDevProxy(tmdbKey) {
  return {
    name: 'tmdb-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tmdb', async (req, res) => {
        const url = new URL(req.url, 'http://localhost')
        url.searchParams.set('api_key', tmdbKey)

        const tmdbResponse = await fetch(`${TMDB_BASE}${url.pathname}?${url.searchParams.toString()}`)
        const data = await tmdbResponse.json()

        res.statusCode = tmdbResponse.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tmdbDevProxy(env.TMDB_KEY)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      globals: true,
    },
  }
})
