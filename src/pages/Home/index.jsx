import categories from '@/config/categories'
import CategorySection from '@/components/CategorySection'
import ReviewsCarousel from '@/components/ReviewsCarousel'

function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-700 py-16 px-6 text-center text-white">
      <span className="inline-block bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full mb-5 tracking-wide">
        ✦ Powered by TMDB API
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
        Explore o melhor<br />
        do <span className="text-indigo-300">cinema</span>
      </h1>
      <p className="text-indigo-200 text-base max-w-md mx-auto mb-8 leading-relaxed">
        Descubra filmes por categoria, salve seus favoritos e compartilhe sua opinião com outros cinéfilos.
      </p>
      <div className="flex gap-3 justify-center">
        <a
          href="/cadastro"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Criar conta grátis
        </a>
        <a
          href="#filmes"
          className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Explorar filmes
        </a>
      </div>
    </div>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <div id="filmes" className="max-w-7xl mx-auto px-6 py-12">
        {categories.map((cat) => (
          <CategorySection
            key={cat.id}
            id={cat.id}
            title={cat.title}
            badge={cat.badge}
            endpoint={cat.endpoint}
            params={cat.params}
          />
        ))}
      </div>
      <ReviewsCarousel />
    </>
  )
}

export default Home
