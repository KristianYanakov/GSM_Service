import { Hero } from '@/components/home/hero'
import { TrustBar } from '@/components/trust-bar'
import { CategoryTiles } from '@/components/home/category-tiles'
import { FeaturedProducts } from '@/components/home/featured-products'
import { ServicesHighlight } from '@/components/home/services-highlight'
import { VisitUs } from '@/components/home/visit-us'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryTiles />
      <FeaturedProducts />
      <ServicesHighlight />
      <VisitUs />
    </>
  )
}
