import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-black text-indigo-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
      <p className="text-gray-500 mb-8">A página que você está procurando não existe.</p>
      <Link
        to="/"
        className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  )
}

export default NotFound
