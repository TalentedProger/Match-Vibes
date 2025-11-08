'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Trophy } from 'lucide-react'

export default function AchievementsPage() {
  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Достижения</h1>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
            <Trophy className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Скоро здесь появятся достижения
          </h2>
          <p className="text-muted-foreground">
            Играйте в игры и зарабатывайте уникальные бейджи
          </p>
        </div>
      </div>
    </AuthGuard>
  )
}
