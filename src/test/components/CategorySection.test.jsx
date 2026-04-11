import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CategorySection from '@/components/CategorySection'
import * as useMoviesModule from '@/hooks/useMovies'

vi.mock('@/hooks/useMovies')

const filmesMock = [
  { id: 1, title: 'Filme Ação 1', vote_average: 8.0, poster_path: '/1.jpg' },
  { id: 2, title: 'Filme Ação 2', vote_average: 7.5, poster_path: '/2.jpg' },
]

describe('CategorySection', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exibe spinner enquanto carrega', () => {
    useMoviesModule.default.mockReturnValue({ filmes: [], loading: true, erro: null })
    render(
      <MemoryRouter>
        <CategorySection title="Ação" badge="ID 28" endpoint="discover/movie" params={{}} />
      </MemoryRouter>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('exibe o título da categoria', () => {
    useMoviesModule.default.mockReturnValue({ filmes: filmesMock, loading: false, erro: null })
    render(
      <MemoryRouter>
        <CategorySection title="Ação" badge="ID 28" endpoint="discover/movie" params={{}} />
      </MemoryRouter>
    )
    expect(screen.getByText('Ação')).toBeInTheDocument()
    expect(screen.getByText('ID 28')).toBeInTheDocument()
  })

  it('renderiza um MovieCard para cada filme', () => {
    useMoviesModule.default.mockReturnValue({ filmes: filmesMock, loading: false, erro: null })
    render(
      <MemoryRouter>
        <CategorySection title="Ação" badge="ID 28" endpoint="discover/movie" params={{}} />
      </MemoryRouter>
    )
    expect(screen.getByText('Filme Ação 1')).toBeInTheDocument()
    expect(screen.getByText('Filme Ação 2')).toBeInTheDocument()
  })

  it('exibe mensagem de erro quando a API falha', () => {
    useMoviesModule.default.mockReturnValue({ filmes: [], loading: false, erro: 'Não foi possível carregar os filmes.' })
    render(
      <MemoryRouter>
        <CategorySection title="Ação" badge="ID 28" endpoint="discover/movie" params={{}} />
      </MemoryRouter>
    )
    expect(screen.getByText('Não foi possível carregar os filmes.')).toBeInTheDocument()
  })
})
