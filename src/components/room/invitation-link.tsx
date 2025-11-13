'use client'

import { useState } from 'react'
import { Copy, Share2, Check, ExternalLink } from 'lucide-react'
import { useTelegram } from '@/hooks/use-telegram'
import { useRoom } from '@/hooks/use-room'

interface InvitationLinkProps {
  invitationCode: string
}

export function InvitationLink({ invitationCode }: InvitationLinkProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [copiedType, setCopiedType] = useState<'telegram' | 'web' | null>(null)
  const { shareUrl, isReady } = useTelegram()
  const { getInvitationLink, getTelegramShareLink, getWebFallbackLink } =
    useRoom()

  const telegramLink = getInvitationLink() // Now always returns Telegram bot link
  const shareLink = getTelegramShareLink()
  const webLink = getWebFallbackLink()

  const handleCopyTelegram = async () => {
    if (!telegramLink) return

    try {
      await navigator.clipboard.writeText(telegramLink)
      setIsCopied(true)
      setCopiedType('telegram')
      setTimeout(() => {
        setIsCopied(false)
        setCopiedType(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyWeb = async () => {
    if (!webLink) return

    try {
      await navigator.clipboard.writeText(webLink)
      setIsCopied(true)
      setCopiedType('web')
      setTimeout(() => {
        setIsCopied(false)
        setCopiedType(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    if (!shareLink) return

    if (isReady && shareUrl) {
      // Use Telegram WebApp share if available
      shareUrl(
        telegramLink!,
        'Присоединяйся к игре в MatchVibe!\nДавай узнаем, насколько совпадают наши вкусы!'
      )
    } else {
      // Fallback to opening share URL
      window.open(shareLink, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Код приглашения:</p>
        <p className="text-3xl font-bold text-foreground font-mono tracking-wider">
          {invitationCode}
        </p>
      </div>

      {/* Telegram Link (Primary) */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
          🤖 Telegram ссылка (рекомендуется):
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={telegramLink || ''}
            readOnly
            className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-foreground font-mono"
          />
          <button
            onClick={handleCopyTelegram}
            className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            aria-label="Копировать Telegram ссылку"
          >
            {isCopied && copiedType === 'telegram' ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Web Link (Fallback) */}
      <div className="bg-muted/30 border border-muted rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Веб-ссылка (резервная):
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={webLink || ''}
            readOnly
            className="flex-1 bg-background px-3 py-2 rounded-lg text-sm text-muted-foreground font-mono"
          />
          <button
            onClick={handleCopyWeb}
            className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
            aria-label="Копировать веб-ссылку"
          >
            {isCopied && copiedType === 'web' ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <Share2 className="h-5 w-5" />
        Отправить в Telegram
      </button>

      {/* Instructions */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <p className="text-sm font-medium text-foreground text-center mb-3">
          📝 Как пригласить друга:
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="flex items-start gap-2">
            <span className="font-semibold text-primary">1.</span>
            <span>
              <strong>Telegram ссылка</strong> - откроет бота, где друг нажмет
              кнопку для входа в игру
            </span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold text-muted-foreground">2.</span>
            <span>
              <strong>Веб-ссылка</strong> - прямая ссылка на игру (если Telegram
              недоступен)
            </span>
          </p>
        </div>
        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Используйте кнопку "Отправить в Telegram" для быстрой отправки
          </p>
        </div>
      </div>
    </div>
  )
}
