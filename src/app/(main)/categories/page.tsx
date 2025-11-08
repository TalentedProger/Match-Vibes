'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { RoomCreator } from '@/components/room/room-creator'
import { Utensils, Film, Heart, Plane, Palette, Dog } from 'lucide-react'

const categories = [
  {
    id: 'food',
    name: 'Еда и напитки',
    description: 'Узнайте ваши общие гастрономические предпочтения',
    icon: Utensils,
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'movies',
    name: 'Фильмы',
    description: 'Найдите общие любимые фильмы и сериалы',
    icon: Film,
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'animals',
    name: 'Животные',
    description: 'Обсудите любимых питомцев',
    icon: Dog,
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'relationships',
    name: 'Отношения',
    description: 'Узнайте взгляды на отношения',
    icon: Heart,
    color: 'from-pink-400 to-red-500',
  },
  {
    id: 'travel',
    name: 'Путешествия',
    description: 'Найдите общие мечты о путешествиях',
    icon: Plane,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'lifestyle',
    name: 'Лайфстайл',
    description: 'Сравните образ жизни',
    icon: Palette,
    color: 'from-green-400 to-teal-500',
  },
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsCreatorOpen(true)
  }

  const handleCloseCreator = () => {
    setIsCreatorOpen(false)
    setSelectedCategory(null)
  }

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Выберите категорию
          </h1>
          <p className="text-muted-foreground">
            Начните игру, выбрав одну из категорий
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group relative overflow-hidden bg-card rounded-2xl p-6 text-left hover:shadow-lg transition-all"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl mb-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 bg-muted/50 rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Скоро здесь появятся реальные категории с вопросами
          </p>
        </div>
      </div>

      {/* Room Creator Modal */}
      {selectedCategory && (
        <RoomCreator
          isOpen={isCreatorOpen}
          onClose={handleCloseCreator}
          categoryId={selectedCategory}
        />
      )}
    </AuthGuard>
  )
}
