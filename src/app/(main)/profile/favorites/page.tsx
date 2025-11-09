'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Heart, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FavoritesPage() {
  const router = useRouter()

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 min-h-screen flex flex-col">
        {/* Back Button */}
        <div className="py-4">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Назад</span>
          </button>
        </div>

        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
            <Heart className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Любимчики</h2>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Здесь будут ваши любимые элементы
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Играйте в игры, чтобы добавить любимчиков
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
