import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabase'
import FilmComments from '@/components/FilmComments'

const POSTER_BASE = 'https://image.tmdb.org/t/p/original'
const ACTOR_BASE = 'https://image.tmdb.org/t/p/w185'
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY

function Filme() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [filme, setFilme] = useState(null)
  const [elenco, setElenco] = useState([])
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState(null)
  const mensagemTimer = useRef(null)

  useEffect(() => {
    async function carregar() {
      try {
        const params = { params: { api_key: TMDB_KEY, language: 'pt-BR' } }
        const [resFilme, resCredits] = await Promise.all([
          api.get(`/movie/${id}`, params),
          api.get(`/movie/${id}/credits`, params),
        ])
        setFilme(resFilme.data)
        setElenco(resCredits.data.cast.slice(0, 5))
        setLoading(false)
      } catch {
        setLoading(false)
        navigate('/', { replace: true })
      }
    }
    carregar()
  }, [id, navigate])

  async function salvarFavorito() {
    if (!usuario) { navigate('/login'); return }
    setSalvando(true)
    const { error } = await supabase.from('favorites').insert({
      user_id: usuario.id,
      film_id: filme.id,
      film_title: filme.title,
      film_poster: filme.poster_path,
    })
    setSalvando(false)
    if (error?.code === '23505') {
      setMensagem('Este filme já está nos seus favoritos.')
    } else if (error) {
      setMensagem('Erro ao salvar. Tente novamente.')
    } else {
      setMensagem('Filme salvo nos favoritos!')
    }
    clearTimeout(mensagemTimer.current)
    mensagemTimer.current = setTimeout(() => setMensagem(null), 3000)
  }

  useEffect(() => () => clearTimeout(mensagemTimer.current), [])

  function estrelas(nota) {
    const cheia = Math.round(nota / 2)
    return '★'.repeat(cheia) + '☆'.repeat(5 - cheia)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-400 animate-pulse">
        Carregando filme...
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-700 pb-16">
        <div className="max-w-4xl mx-auto px-6 pt-10">
          <Link to="/" className="text-indigo-300 text-sm hover:text-white mb-6 inline-block">
            ← Voltar
          </Link>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Poster */}
            <img
              src={`${POSTER_BASE}${filme.poster_path}`}
              alt={filme.title}
              decoding="async"
              className="w-full sm:w-48 rounded-2xl shadow-2xl sm:flex-shrink-0"
            />
            {/* Meta */}
            <div className="flex-1 pt-2">
              {/* Gêneros */}
              <div className="flex gap-2 flex-wrap mb-3">
                {filme.genres?.map((g) => (
                  <span key={g.id} className="bg-white/15 border border-white/25 text-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">{filme.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 text-lg tracking-widest">{estrelas(filme.vote_average)}</span>
                <span className="text-2xl font-black text-white">{filme.vote_average?.toFixed(1)}</span>
                <span className="text-indigo-300 text-sm">/ 10</span>
              </div>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-xl mb-6">{filme.overview}</p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={salvarFavorito}
                  disabled={salvando}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {salvando ? 'Salvando...' : '♡ Salvar nos Favoritos'}
                </button>
                <a
                  href={`https://youtube.com/results?search_query=${encodeURIComponent(filme.title + ' trailer')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                >
                  ▶ Ver Trailer
                </a>
              </div>
              {mensagem && (
                <p className="mt-3 text-sm text-indigo-200 font-medium">{mensagem}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

        {/* Comentários */}
        <FilmComments filmId={Number(id)} />

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Informações */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Informações</h3>
            <dl className="space-y-2 text-sm">
              {[
                ['Lançamento', filme.release_date?.split('-')[0]],
                ['Duração', filme.runtime ? `${Math.floor(filme.runtime / 60)}h ${filme.runtime % 60}min` : '—'],
                ['Idioma', filme.original_language?.toUpperCase()],
                ['Avaliação', `⭐ ${filme.vote_average?.toFixed(1)} / 10`],
                ['Votos', filme.vote_count?.toLocaleString('pt-BR')],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Elenco */}
          {elenco.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Elenco Principal</h3>
              <ul className="space-y-3">
                {elenco.map((ator, i) => (
                  <li key={ator.id}>
                    <div className="flex items-center gap-3">
                      {ator.profile_path ? (
                        <img
                          src={`${ACTOR_BASE}${ator.profile_path}`}
                          alt={ator.name}
                          loading="lazy"
                          decoding="async"
                          className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 text-lg flex-shrink-0">
                          🎭
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ator.name}</p>
                        <p className="text-xs text-gray-400">como {ator.character}</p>
                      </div>
                    </div>
                    {i < elenco.length - 1 && <hr className="border-gray-100 mt-3" />}
                  </li>
                ))}
              </ul>
              <a
                href={`https://www.themoviedb.org/movie/${id}/cast`}
                target="_blank"
                rel="noreferrer"
                className="block text-center mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Ver elenco completo →
              </a>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

export default Filme
