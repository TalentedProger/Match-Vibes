'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { RoomCreator } from '@/components/room/room-creator'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Subcategory } from '@/types/subcategory'
import type { Category } from '@/types/category'

export default function SubcategoriesPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  )
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)

  // Fetch category and subcategories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch category
        const categoryRes = await fetch(`/api/categories/${categoryId}`)
        if (!categoryRes.ok) throw new Error('Failed to fetch category')
        const categoryData = await categoryRes.json()
        setCategory(categoryData.category)

        // Fetch subcategories
        const subcategoriesRes = await fetch(
          `/api/categories/${categoryId}/subcategories`
        )
        if (!subcategoriesRes.ok)
          throw new Error('Failed to fetch subcategories')
        const subcategoriesData = await subcategoriesRes.json()
        setSubcategories(subcategoriesData.subcategories)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Не удалось загрузить данные')
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchData()
    }
  }, [categoryId])

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    setIsCreatorOpen(true)
  }

  const handleCloseCreator = () => {
    setIsCreatorOpen(false)
    setSelectedSubcategory(null)
  }

  return (
    <AuthGuard>
      <div className="container max-w-2xl mx-auto px-4 py-4 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Назад</span>
          </button>

          {category && (
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  background: category.color || 'hsl(var(--primary))',
                }}
              >
                {category.icon || '📦'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="text-muted-foreground">
            Выберите подтему для создания игры
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-center">
            <p className="text-error font-medium mb-2">Ошибка загрузки</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Subcategories List */}
        {!isLoading && !error && subcategories.length > 0 && (
          <div className="space-y-3">
            {subcategories.map(subcategory => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategorySelect(subcategory.id)}
                className="w-full bg-card rounded-xl p-4 text-left hover:shadow-md transition-all active:scale-98 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  {/* Icon or bullet */}
                  {subcategory.icon ? (
                    <span className="text-2xl">{subcategory.icon}</span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}

                  <div>
                    {/* Subcategory name */}
                    <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                      {subcategory.name}
                    </h3>

                    {/* Subcategory description */}
                    {subcategory.description && (
                      <p className="text-sm text-muted-foreground">
                        {subcategory.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  →
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && subcategories.length === 0 && (
          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              В этой категории пока нет подтем
            </p>
          </div>
        )}
      </div>

      {/* Room Creator Modal */}
      {selectedSubcategory && (
        <RoomCreator
          isOpen={isCreatorOpen}
          onClose={handleCloseCreator}
          categoryId={categoryId}
          subcategoryId={selectedSubcategory}
        />
      )}
    </AuthGuard>
  )
}
