import { createContext, useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'

export const AuthContext = createContext({ usuario: null })

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted) return
        setUsuario(data.session?.user ?? null)
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setCarregando(false)
      })

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (!mounted) return
      setUsuario(session?.user ?? null)
      setCarregando(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (carregando) return null

  return (
    <AuthContext.Provider value={{ usuario, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}
