'use client'

import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useCategories } from '@/hooks/use-categories'
import { Loader2, ChevronRight } from 'lucide-react'

export default function CategoriesPage() {
  const router = useRouter()
  const { categories, isLoading, error } = useCategories()

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to subcategories page
    router.push(`/categories/${categoryId}`)
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

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group relative overflow-hidden bg-card rounded-2xl p-6 text-left hover:shadow-lg transition-all active:scale-95 flex items-center justify-between"
              >
                {/* Gradient overlay on hover */}
                {category.color && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: category.color?.includes('gradient')
                        ? category.color
                        : `linear-gradient(135deg, ${category.color}, ${category.color})`,
                    }}
                  />
                )}

                <div className="relative flex-1">
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 text-2xl"
                    style={{
                      background: category.color || 'hsl(var(--primary))',
                    }}
                  >
                    {category.icon || '📦'}
                  </div>

                  {/* Category name */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {category.name}
                  </h3>

                  {/* Category description */}
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Chevron icon */}
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="bg-muted/50 rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Пока нет доступных категорий
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
