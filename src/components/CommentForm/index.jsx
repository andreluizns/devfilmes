import { useState } from 'react'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

function CommentForm({ filmId, onNovoComentario }) {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!texto.trim()) return

    setEnviando(true)
    const { data, error } = await supabase
      .from('film_comments')
      .insert({ user_id: usuario.id, film_id: filmId, comment: texto.trim() })
      .select(`
        id, comment, created_at,
        profiles ( name, city, state, avatar_url )
      `)

    setEnviando(false)
    if (!error && data?.[0]) {
      setTexto('')
      onNovoComentario(data[0])
      toast('Comentário publicado!', 'success')
    } else {
      toast('Erro ao publicar comentário. Tente novamente.', 'error')
    }
  }

  const iniciais = usuario.email?.[0].toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {iniciais}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{usuario.email}</p>
        </div>
      </div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escreva seu comentário sobre este filme..."
        className="w-full border border-gray-200 rounded-xl p-3 text-sm font-normal text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none h-20 mb-3"
      />
      <button
        type="submit"
        disabled={enviando || !texto.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
      >
        {enviando ? 'Publicando...' : 'Publicar comentário'}
      </button>
    </form>
  )
}

export default CommentForm
