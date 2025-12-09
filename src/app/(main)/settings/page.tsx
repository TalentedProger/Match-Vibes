'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  const handleToggleNotifications = () => {
    setNotifications(!notifications)
    // TODO: Сохранить в базу данных
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleOpenTelegramSupport = () => {
    const webApp = (window as any).Telegram?.WebApp
    if (webApp) {
      webApp.openTelegramLink('https://t.me/MatchVibeSupport')
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-[56px] z-10 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Настройки</h1>
          </div>
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Account Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Аккаунт
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border">
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (
                      user?.firstName?.[0] ||
                      user?.username?.[0] ||
                      '?'
                    ).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {user?.firstName || user?.username || 'Пользователь'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{user?.username || 'user'}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Appearance Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Внешний вид
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Тема оформления
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Выберите цветовую схему
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'light', label: 'Светлая', icon: Sun },
                    { value: 'dark', label: 'Тёмная', icon: Moon },
                    { value: 'system', label: 'Авто', icon: Globe },
                  ].map(option => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                          theme === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Notifications Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Уведомления
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border">
              <button
                onClick={handleToggleNotifications}
                className="w-full p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    Push-уведомления
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Уведомления об игре и партнёрах
                  </p>
                </div>
                <div
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    notifications ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </button>
            </div>
          </motion.section>

          {/* Privacy Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Конфиденциальность
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border">
              <button className="w-full p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    Политика конфиденциальности
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Как мы обрабатываем данные
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.section>

          {/* Support Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              Поддержка
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border">
              <button
                onClick={handleOpenTelegramSupport}
                className="w-full p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    Помощь и поддержка
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Напишите нам в Telegram
                  </p>
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.section>

          {/* App Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
              О приложении
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">MatchVibe</p>
                  <p className="text-sm text-muted-foreground">Версия 1.0.0</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Bottom padding for nav */}
          <div className="h-20" />
        </div>
      </div>
    </AuthGuard>
  )
}
