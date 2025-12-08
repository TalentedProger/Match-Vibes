'use client'

import { motion } from 'framer-motion'
import type { FunFact } from '@/types/stats'

interface FunFactsCardProps {
  facts: FunFact[]
}

export function FunFactsCard({ facts }: FunFactsCardProps) {
  if (facts.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>💡</span>
        Интересные факты
      </h3>

      <div className="space-y-3">
        {facts.map((fact, index) => (
          <motion.div
            key={fact.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-background/60 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{fact.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{fact.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {fact.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
