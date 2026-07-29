import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '@/services/api'
import categories from '@/config/categories'
import MovieCard from '@/components/MovieCard'

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY

function Categoria() {
  const { id } = useParams()
  const navigate = useNavigate()

  const categoria = categories.find((c) => c.id === id)

  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    if (!categoria) {
      navigate('/', { replace: true })
      return
    }

    let cancelado = false
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    async function buscar() {
      try {
        const resposta = await api.get(categoria.endpoint, {
          params: {
            api_key: TMDB_KEY,
            language: 'pt-BR',
            page: pagina,
            ...categoria.params,
          },
        })
        if (!cancelado) {
          setFilmes(resposta.data.results)
          setTotalPaginas(Math.min(resposta.data.total_pages, 500))
          setLoading(false)
        }
      } catch {
        if (!cancelado) setLoading(false)
      }
    }

    buscar()
    return () => { cancelado = true }
  }, [id, pagina, categoria, navigate])

  // Reset página ao mudar de categoria
  useEffect(() => {
    setPagina(1)
  }, [id])

  if (!categoria) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          ← Voltar
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">{categoria.title}</h1>
        <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
          {categoria.badge}
        </span>
      </div>

      {/* Grade de filmes */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filmes.map((filme) => (
            <MovieCard
              key={filme.id}
              id={filme.id}
              title={filme.title}
              poster={filme.poster_path}
              rating={filme.vote_average?.toFixed(1)}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {!loading && totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <button
            onClick={() => setPagina((p) => p - 1)}
            disabled={pagina === 1}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-500">
            Página <span className="font-bold text-gray-900">{pagina}</span> de{' '}
            <span className="font-bold text-gray-900">{totalPaginas}</span>
          </span>

          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={pagina === totalPaginas}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}

export default Categoria
