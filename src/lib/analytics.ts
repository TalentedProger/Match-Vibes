// Simple analytics tracking utility

interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  timestamp: number
}

type EventName =
  | 'page_view'
  | 'game_started'
  | 'game_completed'
  | 'card_swiped'
  | 'room_created'
  | 'room_joined'
  | 'category_selected'
  | 'result_viewed'
  | 'result_shared'
  | 'favorite_added'
  | 'favorite_removed'
  | 'profile_viewed'
  | 'stats_viewed'
  | 'error_occurred'

class Analytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()

    // Flush events periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), 30000) // Every 30 seconds

      // Flush on page unload
      window.addEventListener('beforeunload', () => this.flush())
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  setUserId(userId: string | null) {
    this.userId = userId
  }

  track(
    name: EventName,
    properties?: Record<string, string | number | boolean>
  ) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId || 'anonymous',
        url: typeof window !== 'undefined' ? window.location.pathname : '',
      },
      timestamp: Date.now(),
    }

    this.events.push(event)

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', name, properties)
    }

    // Auto-flush if buffer is large
    if (this.events.length >= 10) {
      this.flush()
    }
  }

  // Page view tracking
  pageView(pageName: string) {
    this.track('page_view', { page: pageName })
  }

  // Game events
  gameStarted(roomId: string, categoryId: string) {
    this.track('game_started', { roomId, categoryId })
  }

  gameCompleted(roomId: string, matchPercentage: number) {
    this.track('game_completed', { roomId, matchPercentage })
  }

  cardSwiped(direction: 'left' | 'right', questionId: string) {
    this.track('card_swiped', { direction, questionId })
  }

  // Room events
  roomCreated(roomId: string) {
    this.track('room_created', { roomId })
  }

  roomJoined(roomId: string) {
    this.track('room_joined', { roomId })
  }

  // Results
  resultViewed(roomId: string) {
    this.track('result_viewed', { roomId })
  }

  resultShared(method: string) {
    this.track('result_shared', { method })
  }

  // Favorites
  favoriteAdded(itemName: string, categoryId: string) {
    this.track('favorite_added', { itemName, categoryId })
  }

  favoriteRemoved(itemName: string) {
    this.track('favorite_removed', { itemName })
  }

  // Errors
  errorOccurred(errorCode: string, message: string) {
    this.track('error_occurred', { errorCode, message })
  }

  // Flush events to backend
  private async flush() {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      // In production, send to analytics endpoint
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: eventsToSend }),
        })
      }
    } catch (error) {
      // Re-queue failed events (limited to prevent memory issues)
      if (this.events.length < 100) {
        this.events = [...eventsToSend, ...this.events]
      }
    }
  }
}

// Singleton instance
export const analytics = new Analytics()

// React hook for page tracking
export function usePageTracking(pageName: string) {
  if (typeof window !== 'undefined') {
    // Track on mount
    analytics.pageView(pageName)
  }
}
