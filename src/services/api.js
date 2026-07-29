import axios from 'axios'

const api = axios.create({
  baseURL: '/api/tmdb',
})

api.interceptors.request.use((config) => {
  const path = config.url.replace(/^\/+/, '')
  config.params = { ...config.params, path }
  config.url = ''
  return config
})

export default api
