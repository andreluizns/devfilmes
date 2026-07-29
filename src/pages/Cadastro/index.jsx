import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabase'
import estados from '@/config/estados'
import { useToast } from '@/hooks/useToast'

function Cadastro() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', senha: '', city: '', state: '' })
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)

    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      toast('A senha deve ter pelo menos 6 caracteres.', 'error')
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: { name: form.name, city: form.city, state: form.state },
      },
    })

    setCarregando(false)
    if (error) {
      setErro('Não foi possível criar a conta. Verifique os dados e tente novamente.')
      toast('Não foi possível criar a conta. Verifique os dados e tente novamente.', 'error')
    } else {
      toast('Conta criada com sucesso! Bem-vindo(a) ao DevFilme.', 'success')
      navigate('/')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Dev<span className="text-indigo-600">Filme</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Crie sua conta grátis</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Nome completo', type: 'text', placeholder: 'João Silva' },
            { name: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
            { name: 'senha', label: 'Senha', type: 'password', placeholder: '••••••••' },
            { name: 'city', label: 'Cidade', type: 'text', placeholder: 'São Paulo' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Estado</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Selecione o estado</option>
              {estados.map(({ uf, nome }) => (
                <option key={uf} value={uf}>{nome}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Cadastro
