import type { Product } from '@/types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Neural Peak One',
    description: 'Minimalist high-performance wireless earbuds.',
    longDescription:
      'Experience sound like never before. The Neural Peak One features adaptive noise cancellation, 40-hour battery life, and a titanium-coated driver for crystal clear highs and deep, resonant lows.',
    price: 249.0,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    name: 'Slate Chrono',
    description: 'Precision engineered brushed steel timepiece.',
    longDescription:
      'The Slate Chrono is the ultimate companion for the modern professional. Water-resistant up to 50m, sapphire crystal glass, and a bespoke Swiss movement. Hand-finished with premium Italian leather strap.',
    price: 599.0,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    name: 'Lumina Desk Lamp',
    description: 'Smart lighting with circadian rhythm tracking.',
    longDescription:
      'More than just a lamp. Lumina adjusts its color temperature throughout the day to support your natural rhythm. Integrated wireless charging pad and gesture-controlled brightness.',
    price: 185.0,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Aether Pack 20',
    description: 'Urban-optimized waterproof commuter bag.',
    longDescription:
      'Designed for the digital nomad. The Aether Pack 20 features a suspended laptop compartment, hidden passport pocket, and recycled ocean-plastic fabric that is 100% waterproof.',
    price: 145.0,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=600',
  },
]
