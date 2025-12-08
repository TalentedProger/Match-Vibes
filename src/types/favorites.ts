// Favorites type definitions

export interface Favorite {
  id: string
  userId: string
  itemName: string
  categoryId: string
  imageUrl: string | null
  categoryName?: string
  categoryIcon?: string
  addedAt: string
}

export interface FavoritesByCategory {
  categoryId: string
  categoryName: string
  categoryIcon: string
  items: Favorite[]
}

export interface AddFavoriteParams {
  userId: string
  itemName: string
  categoryId: string
  imageUrl?: string
}

export interface RemoveFavoriteParams {
  userId: string
  favoriteId: string
}

export interface FavoritesResponse {
  favorites: Favorite[]
  totalCount: number
  byCategory: FavoritesByCategory[]
}
