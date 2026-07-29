import { useState, useEffect } from 'react'
import api from '@/services/api'

function useMovies(endpoint, params) {
  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function buscar() {
      try {
        const resposta = await api.get(endpoint, {
          params: {
            language: 'pt-BR',
            page: 1,
            ...params,
          },
        })
        if (!cancelado) {
          setFilmes(resposta.data.results.slice(0, 6))
          setLoading(false)
        }
      } catch {
        if (!cancelado) {
          setErro('Não foi possível carregar os filmes.')
          setLoading(false)
        }
      }
    }

    buscar()
    return () => { cancelado = true }
  }, [endpoint])

  return { filmes, loading, erro }
}

export default useMovies
