'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Thali', 'Breads', 'Desserts', 'Beverages'] as const
type Category = (typeof CATEGORIES)[number]

const DISHES: { name: string; price: number; img: string; cats: Category[] }[] = [
  { name: 'Butter Chicken', price: 299, img: '/images/butter-chicken.png', cats: ['Non-Veg'] },
  { name: 'Paneer Lababdar', price: 249, img: '/images/paneer-lababdar.png', cats: ['Veg'] },
  { name: 'Dal Makhani', price: 199, img: '/images/dal-makhani.png', cats: ['Veg'] },
  { name: 'Chicken Biryani', price: 299, img: '/images/chicken-biryani.png', cats: ['Non-Veg'] },
  { name: 'Veg Biryani', price: 229, img: '/images/veg-biryani.png', cats: ['Veg'] },
  { name: 'Tandoori Platter', price: 499, img: '/images/tandoori-platter.png', cats: ['Non-Veg', 'Thali'] },
  { name: 'Gulab Jamun', price: 139, img: '/images/gulab-jamun.png', cats: ['Desserts', 'Veg'] },
  { name: 'Masala Chai', price: 59, img: '/images/masala-chai.png', cats: ['Beverages', 'Veg'] },
]

export function Dishes() {
  const [active, setActive] = useState<Category>('All')

  const filtered =
    active === 'All' ? DISHES : DISHES.filter((d) => d.cats.includes(active))

  return (
    <section id="menu" className="px-4 pb-12 md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card p-6 clay md:p-8">
        <p className="text-center text-xs font-bold tracking-[0.25em] text-primary">
          OUR SIGNATURE DISHES
        </p>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                active === cat
                  ? 'bg-primary text-primary-foreground clay-red'
                  : 'bg-clay-tint text-foreground/70 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((dish) => (
            <article
              key={dish.name}
              className="clay-lift flex flex-col overflow-hidden rounded-2xl bg-background p-3 clay-sm"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={dish.img || '/placeholder.svg'}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 text-center text-sm font-bold">{dish.name}</h3>
              <p className="mt-1 text-center text-base font-extrabold text-primary">
                ₹{dish.price}
              </p>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            No dishes in this category yet.
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground clay-red transition-transform hover:-translate-y-0.5"
          >
            View Full Menu
            <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
              <ArrowRight className="size-3.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
