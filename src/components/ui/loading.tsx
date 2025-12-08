'use client'

import { motion } from 'framer-motion'
import { Loader2, Heart, Sparkles } from 'lucide-react'

interface LoadingProps {
  message?: string
  variant?: 'default' | 'game' | 'fullscreen'
}

export function Loading({
  message = 'Загрузка...',
  variant = 'default',
}: LoadingProps) {
  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full"
          >
            <Loader2 className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-foreground font-medium">{message}</p>
        </motion.div>
      </div>
    )
  }

  if (variant === 'game') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="h-6 w-6 text-secondary" />
          </motion.div>
        </motion.div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}

// Skeleton components
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-muted animate-pulse rounded-md ${className || ''}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 bg-card rounded-xl p-4">
      <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-card rounded-xl p-4 space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <StatsSkeleton />
    </div>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="relative max-w-sm mx-auto">
      <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
