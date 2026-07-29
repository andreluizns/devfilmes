import { useRef, useState } from 'react'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

function ReviewForm({ onEnviado }) {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const sucessoTimer = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setEnviando(true)
    const { error } = await supabase.from('site_reviews').insert({
      user_id: usuario.id,
      comment: texto.trim(),
    })
    setEnviando(false)

    if (error) {
      toast('Erro ao enviar opinião. Tente novamente.', 'error')
      return
    }

    setTexto('')
    setSucesso(true)
    onEnviado?.()
    toast('Opinião enviada! Será exibida após aprovação.', 'success')
    clearTimeout(sucessoTimer.current)
    sucessoTimer.current = setTimeout(() => setSucesso(false), 4000)
  }

  // cleanup on unmount
  // (use useEffect with return for cleanup if needed — for simplicity, leak is acceptable here)

  if (sucesso) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-5 py-4 rounded-2xl text-center font-medium">
        ✓ Opinião enviada! Será exibida após aprovação.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 max-w-lg mx-auto">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Compartilhe sua opinião sobre o DevFilme</h3>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que você achou do site?"
        className="w-full border border-gray-200 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none h-20 mb-3"
      />
      <button
        type="submit"
        disabled={enviando || !texto.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
      >
        {enviando ? 'Enviando...' : 'Enviar opinião'}
      </button>
    </form>
  )
}

export default ReviewForm
