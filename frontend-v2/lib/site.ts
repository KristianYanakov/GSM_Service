export const site = {
  name: 'Mobilo',
  tagline: 'Phones, accessories & repairs in Sofia',
  phone: '+359 88 123 4567',
  phoneHref: 'tel:+359881234567',
  email: 'hello@mobilo.bg',
  address: {
    street: 'ul. Graf Ignatiev 15',
    city: '1000 Sofia, Bulgaria',
    area: 'Center, near Sv. Sedmochislenitsi',
  },
  coords: [42.6919, 23.3262] as [number, number],
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=42.6919,23.3262',
  hours: [
    { label: 'Monday – Friday', value: '09:30 – 19:30' },
    { label: 'Saturday', value: '10:00 – 17:00' },
    { label: 'Sunday', value: 'Closed' },
  ],
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
  },
}

export const navLinks = [
  { href: '/store', label: 'Store' },
  { href: '/services', label: 'Services' },
  { href: '/location', label: 'Location' },
]

export function formatPrice(value: number) {
  return `${value.toFixed(2)} €`
}
