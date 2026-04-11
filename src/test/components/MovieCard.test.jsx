import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from '@/components/MovieCard'

const filmeProps = {
  id: 550,
  title: 'Clube da Luta',
  poster: '/poster.jpg',
  rating: 8.8,
}

function renderCard(props = filmeProps) {
  return render(
    <MemoryRouter>
      <MovieCard {...props} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  it('exibe o título do filme', () => {
    renderCard()
    expect(screen.getByText('Clube da Luta')).toBeInTheDocument()
  })

  it('exibe a nota do filme', () => {
    renderCard()
    expect(screen.getByText('8.8')).toBeInTheDocument()
  })

  it('o link aponta para /filme/:id', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/filme/550')
  })

  it('exibe a imagem do poster com alt correto', () => {
    renderCard()
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Clube da Luta')
    expect(img).toHaveAttribute('src', expect.stringContaining('/poster.jpg'))
  })

  it('exibe placeholder quando poster é null', () => {
    renderCard({ ...filmeProps, poster: null })
    expect(screen.getByText('🎬')).toBeInTheDocument()
  })
})
