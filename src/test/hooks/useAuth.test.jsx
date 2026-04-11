import { renderHook, act, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabase'

vi.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('useAuth', () => {
  beforeEach(() => vi.clearAllMocks())

  it('usuario começa como null antes da sessão ser lida', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.usuario).toBeNull())
  })

  it('preenche usuario após leitura da sessão ativa', async () => {
    const usuarioMock = { id: 'abc', email: 'teste@email.com' }
    supabase.auth.getSession.mockResolvedValue({ data: { session: { user: usuarioMock } } })
    supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.usuario).toEqual(usuarioMock))
  })
})
