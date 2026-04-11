import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import ReviewForm from '@/components/ReviewForm'

function ReviewCard({ review }) {
  const perfil = review.profiles
  const iniciais = perfil?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex-shrink-0 w-72">
      <p className="text-3xl text-indigo-200 leading-none mb-2">"</p>
      <p className="text-sm text-gray-600 italic leading-relaxed mb-4 line-clamp-4">
        {review.comment}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {iniciais}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{perfil?.name ?? 'Usuário'}</p>
          <p className="text-xs text-gray-400">
            {perfil?.city && perfil?.state ? `${perfil.city}, ${perfil.state}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}

function ReviewsCarousel() {
  const { usuario } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from('site_reviews')
        .select(`id, comment, created_at, profiles ( name, city, state )`)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(10)

      setReviews(data || [])
      setLoading(false)
    }
    carregar()
  }, [])

  if (loading) return null
  if (reviews.length === 0 && !usuario) return null

  return (
    <section className="bg-white border-t border-gray-200 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-xs font-bold text-indigo-600 tracking-widest uppercase mb-2">Comunidade</p>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-8">O que nossos usuários dizem</h2>

        {reviews.length > 0 && (
          <div className="flex gap-5 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}

        {usuario && <ReviewForm />}
      </div>
    </section>
  )
}

export default ReviewsCarousel
