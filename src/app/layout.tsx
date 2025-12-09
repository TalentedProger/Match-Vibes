import type { Metadata, Viewport } from 'next'
import './globals.css'
import { TelegramProvider } from '@/components/providers/telegram-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TelegramSafeArea } from '@/components/telegram-safe-area'
import { TelegramNavigation } from '@/components/telegram-navigation'

export const metadata: Metadata = {
  title: 'MatchVibe - Find Your Shared Vibe',
  description: 'Discover shared interests through interactive games',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MatchVibe',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#141419' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Telegram Web App Script */}
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.Telegram && window.Telegram.WebApp) {
                  window.Telegram.WebApp.ready();
                  // Set initial CSS variables for safe areas
                  document.documentElement.style.setProperty('--tg-safe-bottom', '80px');
                  document.documentElement.style.setProperty('--tg-safe-top', '0px');
                  document.documentElement.style.setProperty('--tg-content-padding', '16px');
                  document.documentElement.style.setProperty('--tg-nav-height', '0px');
                  // Try requestFullscreen first (Telegram 7.7+), fallback to expand
                  if (typeof window.Telegram.WebApp.requestFullscreen === 'function') {
                    window.Telegram.WebApp.requestFullscreen();
                  } else {
                    window.Telegram.WebApp.expand();
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TelegramProvider>
            <TelegramSafeArea />
            <TelegramNavigation />
            <div className="pt-[var(--tg-nav-height,0px)] pb-[calc(var(--tg-safe-bottom,0px)+var(--tg-content-padding,0px))] mt-[var(--tg-content-padding,16px)]">
              {children}
            </div>
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
