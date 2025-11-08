'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Любимчики</h1>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
            <Heart className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Здесь будут ваши любимые элементы
          </h2>
          <p className="text-muted-foreground">
            Играйте в игры, чтобы добавить любимчиков
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
