import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, describe, it, expect } from 'vitest'
import ProtectedRoute from '@/components/ProtectedRoute'
import * as useAuthModule from '@/hooks/useAuth'

vi.mock('@/hooks/useAuth')

function renderRota(usuario) {
  useAuthModule.useAuth.mockReturnValue({ usuario })
  return render(
    <MemoryRouter initialEntries={['/favoritos']}>
      <Routes>
        <Route path="/login" element={<div>Página de Login</div>} />
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute>
              <div>Conteúdo Protegido</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('exibe o conteúdo quando usuário está logado', () => {
    renderRota({ id: '1', email: 'user@test.com' })
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument()
  })

  it('redireciona para /login quando usuário é null', () => {
    renderRota(null)
    expect(screen.getByText('Página de Login')).toBeInTheDocument()
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument()
  })
})
