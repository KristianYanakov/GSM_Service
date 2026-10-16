import type { Metadata } from 'next'
import { PageHeader, SectionHeading } from '@/components/page-header'
import { ShopDetails } from '@/components/shop-details'
import { ShopMap } from '@/components/shop-map'
import { PhotoGallery } from '@/components/location/photo-gallery'
import { ContactBanner } from '@/components/contact-banner'
import { getShopInfo } from '@/lib/api/shopInfo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Visit Us',
  description: `Find ${site.name} at ${site.address.street}, Sofia. Opening hours, directions and photos of the shop.`,
}

export default async function LocationPage() {
  const shopInfo = await getShopInfo().catch(() => null)
  const aboutText =
    shopInfo?.about_text ||
    `${site.name} is a small, family-run phone shop in the center of Sofia. Since 2016 we've repaired more than 15,000 phones and helped our neighbours pick the right device — come say hi, the coffee is on us while you wait.`

  return (
    <>
      <PageHeader
        title="Visit us in Sofia"
        description={aboutText}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Location' }]}
      />

      <section className="container-page grid gap-5 pb-14 md:pb-20 lg:grid-cols-[420px_1fr] lg:gap-6">
        <ShopMap className="order-1 h-72 md:h-96 lg:order-2 lg:h-full lg:min-h-[520px]" />
        <div className="order-2 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:p-8 lg:order-1">
          <ShopDetails showName />
        </div>
      </section>

      <section className="container-page flex flex-col gap-6 pb-14 md:gap-8 md:pb-20">
        <SectionHeading
          eyebrow="Gallery"
          title="Inside the shop"
          description="Tap a photo to see it larger."
        />
        <PhotoGallery />
      </section>

      <ContactBanner
        variant="social"
        title="Questions? We reply fast."
        description="Call, email or message us on Facebook and Instagram — we usually answer within the hour during opening times."
      />
    </>
  )
}