import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabase'

function Header() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Dev<span className="text-indigo-600">Filme</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Início
          </Link>

          {usuario ? (
            <>
              <Link
                to="/favoritos"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Favoritos
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                Sair
              </button>
              <Link
                to="/perfil"
                title="Editar perfil"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
              >
                {usuario.email?.[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
