import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ id, title, poster, rating }) {
  return (
    <Link
      to={`/filme/${id}`}
      className={cn(
        'group block bg-white rounded-xl border border-gray-200 overflow-hidden',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      <div className="aspect-[2/3] overflow-hidden bg-indigo-50">
        {poster ? (
          <img
            src={`${POSTER_BASE}${poster}`}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎬
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-gray-900 truncate mb-1">{title}</p>
        <div className="flex items-center gap-1">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs text-gray-500 font-medium">{rating}</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
