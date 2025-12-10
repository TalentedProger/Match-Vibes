'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide BottomNav on game pages
  const isGamePage = pathname?.startsWith('/game/')

  if (isGamePage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
