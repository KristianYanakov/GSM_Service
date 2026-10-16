import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs, SectionHeading } from '@/components/page-header'
import { ProductGallery } from '@/components/product/product-gallery'
import { ProductPurchase } from '@/components/product/product-purchase'
import { ProductTabs } from '@/components/product/product-tabs'
import { ProductCard } from '@/components/product-card'
import { getProductBySlug, getProducts } from '@/lib/api/catalog'
import { adaptApiProduct, categorySlug, getProduct, products, type Product } from '@/lib/products'

async function fetchProductData(slug: string): Promise<{ product: Product | null; related: Product[] }> {
  try {
    const [apiProd, listRes] = await Promise.all([
      getProductBySlug(slug),
      getProducts().catch(() => ({ results: [] })),
    ])
    const product = adaptApiProduct(apiProd)
    const allAdapted = listRes.results.map((p, idx) => adaptApiProduct(p, idx))
    const related = [
      ...allAdapted.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug),
      ...allAdapted.filter((p) => p.categorySlug !== product.categorySlug && p.slug !== product.slug),
    ].slice(0, 4)

    return { product, related }
  } catch {
    const fallback = getProduct(slug) || null
    const related = fallback
      ? [
          ...products.filter((p) => p.category === fallback.category && p.slug !== fallback.slug),
          ...products.filter((p) => p.category !== fallback.category),
        ].slice(0, 4)
      : []
    return { product: fallback, related }
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { product } = await fetchProductData(slug)
  return product ? { title: product.name, description: product.short } : {}
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { product, related } = await fetchProductData(slug)
  if (!product) notFound()

  return (
    <div className="pb-28 md:pb-24">
      <div className="container-page pt-5 pb-5 md:pt-8 md:pb-8">
        <Breadcrumbs
          items={[
            { label: 'Store', href: '/store' },
            { label: product.category, href: `/store?category=${product.categorySlug || categorySlug(product.category)}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-16">
        <ProductGallery images={product.gallery} name={product.name} />
        <ProductPurchase product={product} />
      </div>

      <div className="container-page pt-12 md:pt-16">
        <ProductTabs product={product} />
      </div>

      {related.length > 0 && (
        <section className="container-page flex flex-col gap-6 pt-14 md:pt-20">
          <SectionHeading title="Related products" />
          <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}