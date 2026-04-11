import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function Favoritos() {
  const { usuario } = useAuth()
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', usuario.id)
        .order('created_at', { ascending: false })

      setFavoritos(data || [])
      setLoading(false)
    }
    carregar()
  }, [usuario.id])

  async function remover(favoriteId) {
    await supabase.from('favorites').delete().eq('id', favoriteId)
    setFavoritos((prev) => prev.filter((f) => f.id !== favoriteId))
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-gray-400 animate-pulse">Carregando favoritos...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Meus Favoritos</h1>

      {favoritos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-gray-500 mb-6">Você ainda não salvou nenhum filme.</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            Explorar filmes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {favoritos.map((fav) => (
            <div key={fav.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/filme/${fav.film_id}`}>
                {fav.film_poster ? (
                  <img
                    src={`${POSTER_BASE}${fav.film_poster}`}
                    alt={fav.film_title}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-indigo-50 flex items-center justify-center text-3xl">🎬</div>
                )}
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-900 truncate">{fav.film_title}</p>
                </div>
              </Link>
              <button
                onClick={() => remover(fav.id)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover dos favoritos"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favoritos
