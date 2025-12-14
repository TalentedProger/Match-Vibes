'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useSettingsStore } from '@/stores/settings-store'

interface UseBackgroundMusicOptions {
  src: string
  autoPlay?: boolean
}

export function useBackgroundMusic({
  src,
  autoPlay = true,
}: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const hasInteractedRef = useRef(false)
  const musicEnabled = useSettingsStore(state => state.musicEnabled)
  const musicVolume = useSettingsStore(state => state.musicVolume)

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return

    const audio = new Audio()
    audio.src = src
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = musicVolume

    // For iOS and other browsers that need user interaction
    audio.setAttribute('playsinline', 'true')

    const handleCanPlayThrough = () => {
      setIsLoaded(true)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e)
      setIsLoaded(false)
    }

    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    audioRef.current = audio

    // Preload audio
    audio.load()

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)

      // Полная остановка и очистка аудио при размонтировании компонента
      audio.pause()
      audio.currentTime = 0
      audio.src = ''
      audioRef.current = null
      setIsPlaying(false)
      setIsLoaded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume
    }
  }, [musicVolume])

  // Handle music enabled/disabled
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (musicEnabled && autoPlay && isLoaded && hasInteractedRef.current) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false)
        })
      }
    } else if (!musicEnabled) {
      audio.pause()
    }
  }, [musicEnabled, autoPlay, isLoaded])

  // Manual play function (needed for first interaction)
  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !musicEnabled) return

    hasInteractedRef.current = true
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(console.error)
    }
  }, [musicEnabled])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // Enable play on first user interaction (for browsers that block autoplay)
  useEffect(() => {
    if (!musicEnabled || isPlaying || !isLoaded) return

    const handleFirstInteraction = () => {
      hasInteractedRef.current = true
      play()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction, {
      passive: true,
    })
    document.addEventListener('touchstart', handleFirstInteraction, {
      passive: true,
    })
    document.addEventListener('keydown', handleFirstInteraction, {
      passive: true,
    })

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [musicEnabled, isPlaying, isLoaded, play])

  return {
    isPlaying,
    isLoaded,
    play,
    pause,
    toggle,
  }
}
