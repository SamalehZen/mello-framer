/** Single source of truth for the outlets' public details. */
export const SITE = {
  name: 'Mello',
  email: 'hi@mello.com',
  address: {
    street: '28 Roastery Lane',
    city: 'Brooklyn',
    region: 'NY',
    full: '28 Roastery Lane, Brooklyn, NY',
  },
  hours: 'Open daily 7AM–6PM',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=28+Roastery+Lane+Brooklyn+NY',
  social: [
    { label: 'TikTok', href: 'https://www.tiktok.com/@mellocoffee' },
    { label: 'Instagram', href: 'https://www.instagram.com/mellocoffee' },
    { label: 'Facebook', href: 'https://www.facebook.com/mellocoffee' },
  ],
} as const
