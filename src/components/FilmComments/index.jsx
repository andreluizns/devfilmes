import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import CommentForm from '@/components/CommentForm'

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ComentarioCard({ comentario }) {
  const perfil = comentario.profiles
  const iniciais = perfil?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {iniciais}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{perfil?.name ?? 'Usuário'}</p>
          <p className="text-xs text-gray-400">
            {perfil?.city && perfil?.state ? `${perfil.city}, ${perfil.state}` : ''}
          </p>
        </div>
        <span className="text-xs text-gray-300">{formatarData(comentario.created_at)}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{comentario.comment}</p>
    </div>
  )
}

function FilmComments({ filmId }) {
  const { usuario } = useAuth()
  const [comentarios, setComentarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('film_comments')
        .select(`id, comment, created_at, profiles ( name, city, state, avatar_url )`)
        .eq('film_id', filmId)
        .order('created_at', { ascending: false })

      setComentarios(data || [])
      setLoading(false)
    }
    carregar()
  }, [filmId])

  function adicionarComentario(novoComentario) {
    setComentarios((prev) => [novoComentario, ...prev])
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900 mb-1">Comentários</h2>
      <p className="text-sm text-gray-400 mb-6">{comentarios.length} comentário{comentarios.length !== 1 ? 's' : ''}</p>

      {usuario ? (
        <CommentForm filmId={filmId} onNovoComentario={adicionarComentario} />
      ) : (
        <div className="bg-indigo-50 border border-dashed border-indigo-200 rounded-2xl p-5 text-center mb-6">
          <p className="text-sm text-indigo-600 font-semibold mb-3">
            Faça login para deixar seu comentário
          </p>
          <Link
            to="/login"
            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Entrar ou Criar conta
          </Link>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400 animate-pulse">Carregando comentários...</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">Ainda não há comentários. Seja o primeiro!</p>
      ) : (
        comentarios.map((c) => <ComentarioCard key={c.id} comentario={c} />)
      )}
    </div>
  )
}

export default FilmComments
