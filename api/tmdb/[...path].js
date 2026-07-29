const TMDB_BASE = 'https://api.themoviedb.org/3'

export default async function handler(req, res) {
  const { path, ...query } = req.query
  const tmdbPath = Array.isArray(path) ? path.join('/') : path

  const params = new URLSearchParams(query)
  params.set('api_key', process.env.TMDB_KEY)

  const tmdbResponse = await fetch(`${TMDB_BASE}/${tmdbPath}?${params.toString()}`)
  const data = await tmdbResponse.json()

  res.status(tmdbResponse.status).json(data)
}
