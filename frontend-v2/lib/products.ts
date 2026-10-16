import { type ApiCategory, type ApiProduct } from '@/lib/api/catalog'
import { resolveMediaUrl } from '@/lib/api/client'

export type Category = 'Phones' | 'Cases' | 'Chargers' | 'Accessories' | (string & {})

export type Product = {
  id: number
  slug: string
  name: string
  category: Category
  categorySlug: string
  type: 'phone' | 'accessory'
  price: number
  inStock: boolean
  stockQuantity: number
  featured: boolean
  image: string
  gallery: string[]
  short: string
  description: string
  details: { label: string; value: string }[]
  addedAt: string
}

export type CategoryTile = {
  name: string
  slug: string
  image: string
  blurb: string
}

export const categories: CategoryTile[] = [
  { name: 'Phones', slug: 'phones', image: '/images/cat-phones.png', blurb: 'New & refurbished' },
  { name: 'Cases', slug: 'cases', image: '/images/cat-cases.png', blurb: 'Protection & style' },
  { name: 'Chargers', slug: 'chargers', image: '/images/cat-chargers.png', blurb: 'Fast & wireless' },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/cat-accessories.png',
    blurb: 'Audio, power & more',
  },
]

const CATEGORY_VISUAL_FALLBACKS: Record<string, { image: string; blurb: string }> = {
  phones: { image: '/images/cat-phones.png', blurb: 'New & refurbished' },
  phone: { image: '/images/cat-phones.png', blurb: 'New & refurbished' },
  cases: { image: '/images/cat-cases.png', blurb: 'Protection & style' },
  chargers: { image: '/images/cat-chargers.png', blurb: 'Fast & wireless' },
  accessories: { image: '/images/cat-accessories.png', blurb: 'Audio, power & more' },
}

export function adaptApiCategory(cat: ApiCategory): CategoryTile {
  const key = cat.slug.toLowerCase()
  const fallback = CATEGORY_VISUAL_FALLBACKS[key] || {
    image: '/images/cat-accessories.png',
    blurb: 'Explore our collection',
  }
  return {
    name: cat.name,
    slug: cat.slug,
    image: cat.image ? resolveMediaUrl(cat.image, fallback.image) : fallback.image,
    blurb: cat.blurb || fallback.blurb,
  }
}

export function adaptApiProduct(p: ApiProduct, index = 0): Product {
  const catName = p.category?.name || 'Accessories'
  const catSlug = p.category?.slug || catName.toLowerCase()
  const isPhone =
    p.product_type === 'phone' ||
    catSlug.includes('phone') ||
    catName.toLowerCase().includes('phone')

  const rawPrimary = p.primary_image?.image || p.images?.[0]?.image
  const fallbackImage = isPhone ? '/images/p-phone-1.png' : '/images/p-case.png'
  const primaryUrl = resolveMediaUrl(rawPrimary, fallbackImage)

  const galleryUrls =
    p.images && p.images.length > 0
      ? p.images.map((img) => resolveMediaUrl(img.image, primaryUrl))
      : [primaryUrl]

  const stockQty = typeof p.stock_quantity === 'number' ? p.stock_quantity : 10
  const inStock = stockQty > 0

  const desc =
    p.description ||
    'Available in our Sofia store and online with Econt cash or card on delivery.'

  // Uses short_description if you add it to Django later; otherwise derives a clean summary
  const shortText =
    p.short_description ||
    (p.description && p.description.length > 140
      ? `${p.description.slice(0, 137)}...`
      : desc)

  // Uses details array if you add it to Django later; otherwise provides structured specs
  const detailsList =
    p.details && p.details.length > 0
      ? p.details
      : [
          { label: 'Category', value: catName },
          { label: 'Availability', value: inStock ? `${stockQty} in stock` : 'Out of stock' },
          { label: 'Warranty', value: isPhone ? '24 months' : '12 months' },
          { label: 'Delivery', value: 'Econt (Cash/Card on delivery)' },
        ]

  // Uses is_featured / featured if you add it to Django later; otherwise marks top 4 as featured
  const isFeatured =
    typeof p.is_featured === 'boolean'
      ? p.is_featured
      : typeof p.featured === 'boolean'
        ? p.featured
        : index < 4

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: catName,
    categorySlug: catSlug,
    type: isPhone ? 'phone' : 'accessory',
    price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
    inStock,
    stockQuantity: stockQty,
    featured: isFeatured,
    image: primaryUrl,
    gallery: galleryUrls,
    short: shortText,
    description: desc,
    details: detailsList,
    addedAt: p.created_at || '2026-10-01',
  }
}

export const products: Product[] = [
  {
    id: 101,
    slug: 'nova-x-pro-256',
    name: 'Nova X Pro 256 GB – Midnight Black',
    category: 'Phones',
    categorySlug: 'phones',
    type: 'phone',
    price: 899,
    inStock: true,
    stockQuantity: 5,
    featured: true,
    image: '/images/p-phone-1.png',
    gallery: ['/images/p-phone-1.png', '/images/p-phone-3.png', '/images/cat-phones.png'],
    short:
      'Flagship 6.7" OLED display, triple 50 MP camera and all-day battery with 65 W fast charging.',
    description:
      'The Nova X Pro pairs a bright 120 Hz OLED panel with a pro-grade triple camera system. It comes factory sealed with a 24-month warranty, and our team will transfer your data for free when you pick it up in store.',
    details: [
      { label: 'Display', value: '6.7" OLED, 120 Hz' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Memory', value: '12 GB RAM' },
      { label: 'Camera', value: '50 + 48 + 12 MP' },
      { label: 'Battery', value: '5000 mAh, 65 W' },
      { label: 'Warranty', value: '24 months' },
    ],
    addedAt: '2026-10-02',
  },
  {
    id: 102,
    slug: 'silicone-case-coral',
    name: 'Soft-Touch Silicone Case – Coral',
    category: 'Cases',
    categorySlug: 'cases',
    type: 'accessory',
    price: 24.9,
    inStock: true,
    stockQuantity: 15,
    featured: true,
    image: '/images/p-case.png',
    gallery: ['/images/p-case.png', '/images/cat-cases.png'],
    short: 'Microfiber lining, raised camera lip and a grippy soft-touch finish.',
    description:
      'A slim case that keeps a natural feel while protecting from everyday drops and scratches.',
    details: [
      { label: 'Material', value: 'Liquid silicone' },
      { label: 'Lining', value: 'Microfiber' },
      { label: 'Compatibility', value: 'Nova X Pro, Aero 5G' },
    ],
    addedAt: '2026-10-08',
  },
  {
    id: 103,
    slug: 'gan-charger-65w',
    name: 'GaN Fast Charger 65 W USB-C',
    category: 'Chargers',
    categorySlug: 'chargers',
    type: 'accessory',
    price: 35,
    inStock: true,
    stockQuantity: 12,
    featured: true,
    image: '/images/p-charger.png',
    gallery: ['/images/p-charger.png', '/images/cat-chargers.png', '/images/p-cable.png'],
    short: 'Pocket-size charger that powers phones, tablets and laptops.',
    description:
      'GaN technology keeps it small and cool. Foldable EU plug, works with every USB-C phone.',
    details: [
      { label: 'Output', value: '65 W max' },
      { label: 'Ports', value: '1 × USB-C' },
      { label: 'Plug', value: 'EU, foldable' },
    ],
    addedAt: '2026-09-30',
  },
  {
    id: 104,
    slug: 'wireless-earbuds-air',
    name: 'Air Buds Wireless Earbuds with ANC',
    category: 'Accessories',
    categorySlug: 'accessories',
    type: 'accessory',
    price: 59,
    inStock: true,
    stockQuantity: 8,
    featured: true,
    image: '/images/p-earbuds.png',
    gallery: ['/images/p-earbuds.png', '/images/cat-accessories.png'],
    short: 'Active noise cancelling, 30 hours with the case.',
    description: 'Comfortable earbuds with clear calls, ANC and a pocket-size charging case.',
    details: [
      { label: 'Battery', value: '6 h + 24 h case' },
      { label: 'Bluetooth', value: '5.3' },
    ],
    addedAt: '2026-10-10',
  },
]

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export const featuredSlugs = [
  'nova-x-pro-256',
  'silicone-case-coral',
  'gan-charger-65w',
  'wireless-earbuds-air',
]

export function categorySlug(category: string) {
  return category.toLowerCase()
}