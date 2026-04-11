import { Link } from 'react-router-dom'
import useMovies from '@/hooks/useMovies'
import MovieCard from '@/components/MovieCard'

function CategorySection({ id, title, badge, endpoint, params }) {
  const { filmes, loading, erro } = useMovies(endpoint, params)

  return (
    <section className="mb-12">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {badge}
          </span>
        </div>
        <Link
          to={`/categoria/${id}`}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Ver mais →
        </Link>
      </div>

      <hr className="border-gray-200 mb-4" />

      {/* Estado de carregamento */}
      {loading && (
        <div role="status" className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Estado de erro */}
      {erro && (
        <p className="text-sm text-red-500 py-4">{erro}</p>
      )}

      {/* Grade de filmes */}
      {!loading && !erro && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filmes.map((filme) => (
            <MovieCard
              key={filme.id}
              id={filme.id}
              title={filme.title}
              poster={filme.poster_path}
              rating={filme.vote_average.toFixed(1)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default CategorySection
