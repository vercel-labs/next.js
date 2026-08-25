export const SITE = {
  name: 'Turbo Livelock Repro',
  url: 'http://localhost:3137',
  locale: 'en-US',
}

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/settings', label: 'Settings' },
  { href: '/docs', label: 'Docs' },
  { href: '/contact', label: 'Contact' },
]

export const API_ENDPOINTS = {
  products: '/api/products',
  users: '/api/users',
  orders: '/api/orders',
  blog: '/api/blog',
  search: '/api/search',
}

export const FEATURE_FLAGS = {
  i18n: true,
  analytics: true,
  realtime: false,
  experimental: true,
}