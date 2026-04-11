function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-lg font-extrabold tracking-tight">
            Dev<span className="text-indigo-300">Filme</span>
          </p>
          <p className="text-indigo-400 text-xs mt-1">
            Descubra, salve e compartilhe seus filmes favoritos.
          </p>
        </div>

        <p className="text-indigo-400 text-xs text-center sm:text-right">
          © {ano} DevFilme. Todos os direitos reservados.<br />
          <span className="text-indigo-500">Dados fornecidos por TMDB.</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
