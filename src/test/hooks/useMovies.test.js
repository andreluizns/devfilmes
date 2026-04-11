import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useMovies from '@/hooks/useMovies'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: { get: vi.fn() },
}))

const filmesMock = [
  { id: 1, title: 'Filme A', vote_average: 8.4, poster_path: '/a.jpg' },
  { id: 2, title: 'Filme B', vote_average: 7.1, poster_path: '/b.jpg' },
]

describe('useMovies', () => {
  beforeEach(() => vi.clearAllMocks())

  it('começa com loading=true e filmes=[]', () => {
    api.get.mockResolvedValue({ data: { results: [] } })
    const { result } = renderHook(() => useMovies('movie/now_playing', {}))
    expect(result.current.loading).toBe(true)
    expect(result.current.filmes).toEqual([])
  })

  it('carrega filmes da API e define loading=false', async () => {
    api.get.mockResolvedValue({ data: { results: filmesMock } })
    const { result } = renderHook(() => useMovies('movie/now_playing', {}))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.filmes).toHaveLength(2)
    expect(result.current.filmes[0].title).toBe('Filme A')
  })

  it('define erro quando a API falha', async () => {
    api.get.mockRejectedValue(new Error('Falha na rede'))
    const { result } = renderHook(() => useMovies('movie/now_playing', {}))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.erro).toBe('Não foi possível carregar os filmes.')
    expect(result.current.filmes).toEqual([])
  })

  it('chama a API com endpoint e params corretos', async () => {
    api.get.mockResolvedValue({ data: { results: [] } })
    renderHook(() => useMovies('discover/movie', { with_genres: 28 }))
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('discover/movie', {
        params: expect.objectContaining({ with_genres: 28 }),
      })
    })
  })
})
