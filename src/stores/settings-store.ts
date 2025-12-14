'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  // Music settings
  musicEnabled: boolean
  musicVolume: number

  // Actions
  setMusicEnabled: (enabled: boolean) => void
  setMusicVolume: (volume: number) => void
  toggleMusic: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      // Initial state
      musicEnabled: true,
      musicVolume: 0.5,

      // Actions
      setMusicEnabled: enabled => set({ musicEnabled: enabled }),
      setMusicVolume: volume =>
        set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
      toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),
    }),
    {
      name: 'matchvibe-settings',
      partialize: state => ({
        musicEnabled: state.musicEnabled,
        musicVolume: state.musicVolume,
      }),
    }
  )
)
