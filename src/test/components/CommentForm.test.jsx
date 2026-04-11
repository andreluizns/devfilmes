import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CommentForm from '@/components/CommentForm'
import { supabase } from '@/services/supabase'

vi.mock('@/services/supabase', () => ({
  supabase: { from: vi.fn() },
}))

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-1', email: 'teste@email.com' },
  }),
}))

describe('CommentForm', () => {
  const onNovoComentario = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    supabase.from.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 'c1', comment: 'Ótimo filme!', created_at: new Date().toISOString() }],
          error: null,
        }),
      }),
    })
  })

  it('renderiza o textarea e o botão de envio', () => {
    render(<CommentForm filmId={550} onNovoComentario={onNovoComentario} />)
    expect(screen.getByPlaceholderText(/escreva seu comentário/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /publicar/i })).toBeInTheDocument()
  })

  it('não envia comentário vazio', async () => {
    const user = userEvent.setup()
    render(<CommentForm filmId={550} onNovoComentario={onNovoComentario} />)
    await user.click(screen.getByRole('button', { name: /publicar/i }))
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('envia comentário e limpa o campo', async () => {
    const user = userEvent.setup()
    render(<CommentForm filmId={550} onNovoComentario={onNovoComentario} />)
    await user.type(screen.getByPlaceholderText(/escreva seu comentário/i), 'Ótimo filme!')
    await user.click(screen.getByRole('button', { name: /publicar/i }))
    await waitFor(() => expect(onNovoComentario).toHaveBeenCalledTimes(1))
    expect(screen.getByPlaceholderText(/escreva seu comentário/i)).toHaveValue('')
  })
})
