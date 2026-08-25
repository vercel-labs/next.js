export interface Product {
  id: string
  name: string
  price: number
  currency: string
  category: string
  inStock: boolean
  description: string
  images: string[]
}

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
  preferences: Record<string, unknown>
}

export interface Order {
  id: string
  userId: string
  items: { productId: string; quantity: number; price: number }[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  tags: string[]
  publishedAt: string
}

export interface ApiResponse<T> {
  data: T
  meta: { page: number; perPage: number; total: number }
}