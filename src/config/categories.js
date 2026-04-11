const categories = [
  {
    id: 'lancamentos',
    title: 'Lançamentos',
    badge: 'Em cartaz',
    endpoint: 'movie/now_playing',
    params: {},
  },
  {
    id: 'populares',
    title: 'Populares',
    badge: 'Alta procura',
    endpoint: 'movie/popular',
    params: {},
  },
  {
    id: 'acao',
    title: 'Ação',
    badge: 'ID 28',
    endpoint: 'discover/movie',
    params: { with_genres: 28 },
  },
  {
    id: 'drama',
    title: 'Drama',
    badge: 'ID 18',
    endpoint: 'discover/movie',
    params: { with_genres: 18 },
  },
  {
    id: 'comedia',
    title: 'Comédia',
    badge: 'ID 35',
    endpoint: 'discover/movie',
    params: { with_genres: 35 },
  },
  {
    id: 'terror',
    title: 'Terror',
    badge: 'ID 27',
    endpoint: 'discover/movie',
    params: { with_genres: 27 },
  },
  {
    id: 'policial',
    title: 'Policial / Crime',
    badge: 'ID 80',
    endpoint: 'discover/movie',
    params: { with_genres: 80 },
  },
  {
    id: 'ficcao',
    title: 'Ficção Científica',
    badge: 'ID 878',
    endpoint: 'discover/movie',
    params: { with_genres: 878 },
  },
  {
    id: 'animacao',
    title: 'Animação',
    badge: 'ID 16',
    endpoint: 'discover/movie',
    params: { with_genres: 16 },
  },
]

export default categories
