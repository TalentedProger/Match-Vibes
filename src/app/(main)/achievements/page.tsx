'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Trophy, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AchievementsPage() {
  const router = useRouter()

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 min-h-screen flex flex-col">
        {/* Back Button */}
        <div className="py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Назад</span>
          </button>
        </div>

        {/* Centered Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center -mt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
            <Trophy className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Достижения
          </h2>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Скоро здесь появятся достижения
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Играйте в игры и зарабатывайте уникальные бейджи
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
