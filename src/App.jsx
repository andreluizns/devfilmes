import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import Filme from '@/pages/Filme'
import Favoritos from '@/pages/Favoritos'
import Perfil from '@/pages/Perfil'
import Login from '@/pages/Login'
import Cadastro from '@/pages/Cadastro'
import Categoria from '@/pages/Categoria'
import RecuperarSenha from '@/pages/RecuperarSenha'
import NovaSenha from '@/pages/NovaSenha'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/filme/:id" element={<Filme />} />
              <Route
                path="/favoritos"
                element={
                  <ProtectedRoute>
                    <Favoritos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              <Route path="/categoria/:id" element={<Categoria />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/recuperar-senha" element={<RecuperarSenha />} />
              <Route path="/nova-senha" element={<NovaSenha />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
