'use client'

import { useState } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { useTelegram } from '@/hooks/use-telegram'

interface InvitationLinkProps {
  invitationCode: string
  invitationLink: string
  telegramShareLink: string
}

export function InvitationLink({
  invitationCode,
  invitationLink,
  telegramShareLink,
}: InvitationLinkProps) {
  const [copied, setCopied] = useState(false)
  const { shareUrl } = useTelegram()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = () => {
    // Try Telegram WebApp share first
    if (shareUrl) {
      shareUrl(invitationLink, 'Присоединяйся к игре в MatchVibe! 🎮')
    } else {
      // Fallback to opening Telegram share link
      window.open(telegramShareLink, '_blank')
    }
  }

  return (
    <div className="space-y-4">
      {/* Invitation Code Display */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Код приглашения:</p>
        <p className="text-3xl font-bold text-foreground font-mono tracking-wider">
          {invitationCode}
        </p>
      </div>

      {/* Link Display */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-2">Ссылка:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={invitationLink}
            readOnly
            className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm text-foreground font-mono"
          />
          <button
            onClick={handleCopy}
            className="p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            aria-label="Копировать"
          >
            {copied ? (
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
      <div className="bg-muted/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground text-center">
          Отправьте ссылку партнёру, чтобы начать игру вместе
        </p>
      </div>
    </div>
  )
}
