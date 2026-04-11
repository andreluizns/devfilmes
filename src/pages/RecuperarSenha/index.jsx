import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/services/supabase'

function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    })

    setCarregando(false)
    if (error) {
      setErro('Não foi possível enviar o e-mail. Verifique o endereço.')
    } else {
      setEnviado(true)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <p className="text-5xl mb-4">📧</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">E-mail enviado!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Verifique sua caixa de entrada e clique no link de recuperação.
            O link expira em <strong>5 minutos</strong>.
          </p>
          <Link to="/login" className="text-sm text-indigo-600 font-semibold hover:underline">
            ← Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Dev<span className="text-indigo-600">Filme</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Recuperar senha</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">E-mail da conta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="seu@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {carregando ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            ← Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RecuperarSenha
