'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, User, BarChart3, Trophy } from 'lucide-react'

const navItems = [
  {
    name: 'Главная',
    href: '/',
    icon: Home,
  },
  {
    name: 'Статистика',
    href: '/stats',
    icon: BarChart3,
  },
  {
    name: 'Достижения',
    href: '/achievements',
    icon: Trophy,
  },
  {
    name: 'Профиль',
    href: '/profile',
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
