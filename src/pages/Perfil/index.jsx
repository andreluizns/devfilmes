import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { supabase } from '@/services/supabase'
import estados from '@/config/estados'

function Perfil() {
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', city: '', state: '' })
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('profiles')
        .select('name, city, state')
        .eq('id', usuario.id)
        .single()

      if (data) {
        setForm({ name: data.name ?? '', city: data.city ?? '', state: data.state ?? '' })
      }
      setCarregando(false)
    }
    carregar()
  }, [usuario.id])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    const { error } = await supabase
      .from('profiles')
      .update({ name: form.name, city: form.city, state: form.state })
      .eq('id', usuario.id)

    setSalvando(false)
    if (error) {
      setErro('Não foi possível salvar as alterações. Tente novamente.')
      toast('Não foi possível salvar as alterações. Tente novamente.', 'error')
    } else {
      toast('Perfil atualizado com sucesso!', 'success')
    }
  }

  if (carregando) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <p className="text-gray-400 text-sm animate-pulse">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white text-2xl font-bold">
            {usuario.email?.[0].toUpperCase()}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Meu perfil</h1>
          <p className="text-gray-500 text-sm mt-1">{usuario.email}</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nome completo</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="João Silva"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Cidade</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="São Paulo"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Estado</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione o estado</option>
              {estados.map(({ uf, nome }) => (
                <option key={uf} value={uf}>{nome}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Perfil
