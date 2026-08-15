'use client'

import { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const REVIEWS = [
  {
    quote:
      'Amazing food, great ambience and superb service. Dimple Ki Rasoi truly feels like home!',
    name: 'Rahul Sharma',
  },
  {
    quote:
      'The flavors are authentic and every dish is cooked to perfection. Highly recommended!',
    name: 'Priya Mehta',
  },
  {
    quote:
      'Best place for family dining. We visit here every weekend and love it!',
    name: 'Ankit Verma',
  },
  {
    quote:
      'From the butter chicken to the masala chai, everything was full of flavor and love.',
    name: 'Sneha Kapoor',
  },
  {
    quote:
      'Warm hospitality and generous portions. This is comfort food done right.',
    name: 'Vikram Singh',
  },
]

function ReviewCard({ quote, name }: { quote: string; name: string }) {
  return (
    <div className="relative flex h-full flex-col rounded-2xl bg-background p-6 clay-sm">
      <Quote className="absolute right-5 top-5 size-8 text-primary/15" />
      <div className="flex gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-current" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground/80">
        {`"${quote}"`}
      </p>
      <p className="mt-4 text-sm font-bold text-primary">– {name}</p>
    </div>
  )
}

export function Testimonials() {
  const [start, setStart] = useState(0)
  const perPage = 3
  const maxStart = Math.max(0, REVIEWS.length - perPage)

  const prev = () => setStart((s) => Math.max(0, s - 1))
  const next = () => setStart((s) => Math.min(maxStart, s + 1))

  return (
    <section id="testimonials" className="px-4 pb-12 md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card p-6 clay md:p-8">
        <p className="text-center text-xs font-bold tracking-[0.25em] text-primary">
          OUR HAPPY CLIENTS
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={prev}
            disabled={start === 0}
            aria-label="Previous testimonials"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground clay-red transition-opacity disabled:opacity-40 md:flex"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Desktop: sliding window */}
          <div className="hidden flex-1 grid-cols-3 gap-5 md:grid">
            {REVIEWS.slice(start, start + perPage).map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto md:hidden">
            {REVIEWS.map((r) => (
              <div key={r.name} className="w-[85%] shrink-0 snap-center">
                <ReviewCard {...r} />
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={start === maxStart}
            aria-label="Next testimonials"
            className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground clay-red transition-opacity disabled:opacity-40 md:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                start === i ? 'w-5 bg-primary' : 'w-2 bg-primary/25'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
