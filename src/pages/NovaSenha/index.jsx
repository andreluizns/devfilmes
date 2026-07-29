import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import { useToast } from '@/hooks/useToast'

function NovaSenha() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [sessaoValida, setSessaoValida] = useState(false)
  const [linkExpirado, setLinkExpirado] = useState(false)

  useEffect(() => {
    // Supabase processa o token da URL automaticamente
    const { data: listener } = supabase.auth.onAuthStateChange((evento, session) => {
      if (evento === 'PASSWORD_RECOVERY') {
        setSessaoValida(true)
      } else if (evento === 'SIGNED_IN' && session) {
        setSessaoValida(true)
      }
    })

    // Verifica se já há sessão ativa (token já processado)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessaoValida(true)
      } else {
        // Se após 3s ainda não há sessão, o link provavelmente expirou
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: d }) => {
            if (!d.session) setLinkExpirado(true)
          })
        }, 3000)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      toast('As senhas não coincidem.', 'error')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      toast('A senha deve ter pelo menos 6 caracteres.', 'error')
      return
    }

    setErro(null)
    setCarregando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    setCarregando(false)

    if (error) {
      setErro('Não foi possível alterar a senha. O link pode ter expirado.')
      toast('Não foi possível alterar a senha. O link pode ter expirado.', 'error')
    } else {
      toast('Senha alterada com sucesso!', 'success')
      navigate('/')
    }
  }

  if (linkExpirado) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <p className="text-5xl mb-4">⏰</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Link expirado</h2>
          <p className="text-sm text-gray-500 mb-6">
            O link de recuperação expirou. Solicite um novo.
          </p>
          <Link
            to="/recuperar-senha"
            className="bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  if (!sessaoValida) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <p className="text-gray-400 text-sm animate-pulse">Validando link...</p>
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
          <p className="text-gray-500 text-sm mt-1">Criar nova senha</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {carregando ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NovaSenha
