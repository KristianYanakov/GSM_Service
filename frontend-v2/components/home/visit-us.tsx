import { SectionHeading } from '@/components/page-header'
import { ShopDetails } from '@/components/shop-details'
import { ShopMap } from '@/components/shop-map'

export function VisitUs() {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="grid gap-8 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Visit us"
            title="Drop by our shop in central Sofia"
            description="Walk in for a free diagnosis, pick up your online order, or try accessories in person."
          />
          <ShopDetails />
        </div>
        <ShopMap className="h-64 md:h-80 lg:h-full lg:min-h-96" interactive={false} />
      </div>
    </section>
  )
}
