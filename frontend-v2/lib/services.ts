import { type ApiServiceItem } from '@/lib/api/services'

export type ServiceCategory =
  | 'Screen Repair'
  | 'Battery'
  | 'Charging Port'
  | 'Water Damage'
  | 'Software'
  | (string & {})

export type Service = {
  id?: number
  name: string
  category: ServiceCategory
  description: string
  from: number
  turnaround: string
  featured?: boolean
}

export const serviceCategories: ServiceCategory[] = [
  'Screen Repair',
  'Battery',
  'Charging Port',
  'Water Damage',
  'Software',
]

export function adaptApiService(s: ApiServiceItem, index = 0): Service {
  return {
    id: s.id,
    name: s.name,
    category: s.category?.name || 'Other',
    description: s.description || '',
    from: typeof s.price_from === 'number' ? s.price_from : parseFloat(s.price_from) || 0,
    turnaround: s.turnaround_time || 'Same day',
    featured: typeof s.is_featured === 'boolean' ? s.is_featured : index < 3,
  }
}

export const services: Service[] = [
  {
    name: 'Screen replacement',
    category: 'Screen Repair',
    description: 'Cracked or unresponsive display replaced with a quality panel.',
    from: 59,
    turnaround: '45 min',
    featured: true,
  },
  {
    name: 'Back glass replacement',
    category: 'Screen Repair',
    description: 'Shattered back panel removed and replaced cleanly.',
    from: 49,
    turnaround: '1-2 days',
  },
  {
    name: 'Screen protector fitting',
    category: 'Screen Repair',
    description: 'Bubble-free tempered glass installed while you wait.',
    from: 10,
    turnaround: '10 min',
  },
  {
    name: 'Battery replacement',
    category: 'Battery',
    description: 'New battery for phones that drain fast or shut down early.',
    from: 39,
    turnaround: '30 min',
    featured: true,
  },
  {
    name: 'Battery health check',
    category: 'Battery',
    description: 'Free diagnostic of capacity, cycles and charging behavior.',
    from: 0,
    turnaround: '10 min',
  },
  {
    name: 'Charging port repair',
    category: 'Charging Port',
    description: 'Loose or dead port cleaned or replaced to restore charging.',
    from: 35,
    turnaround: '1 hour',
    featured: true,
  },
  {
    name: 'Port deep clean',
    category: 'Charging Port',
    description: 'Lint and debris removed from the port and speaker grills.',
    from: 10,
    turnaround: '15 min',
  },
  {
    name: 'Water damage treatment',
    category: 'Water Damage',
    description: 'Ultrasonic cleaning and corrosion treatment of the logic board.',
    from: 45,
    turnaround: '1-2 days',
  },
  {
    name: 'Software reinstall',
    category: 'Software',
    description: 'Fix boot loops, freezes and slowdowns with a clean install.',
    from: 20,
    turnaround: '1 hour',
  },
  {
    name: 'Data transfer',
    category: 'Software',
    description: 'Contacts, photos and apps moved safely to your new phone.',
    from: 15,
    turnaround: '30 min',
  },
]

export const faqs = [
  {
    q: 'Do I need an appointment?',
    a: 'No. Walk in any time during opening hours. If you call ahead we can reserve the part so your repair is faster.',
  },
  {
    q: 'Is the diagnosis free?',
    a: 'Yes. We diagnose every phone for free and tell you the exact price before any work starts.',
  },
  {
    q: 'What warranty do you give on repairs?',
    a: 'All repairs come with a 6-month warranty on parts and labor. Keep your receipt and bring the phone back if anything goes wrong.',
  },
  {
    q: 'Will I lose my data?',
    a: 'Most repairs do not affect your data. For software and water-damage repairs we always recommend a backup, and we can help you make one.',
  },
  {
    q: 'Which brands do you repair?',
    a: 'We repair all major brands including Apple, Samsung, Xiaomi, Huawei, Google and Motorola.',
  },
]