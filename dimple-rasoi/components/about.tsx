import Image from 'next/image'
import { Flame, Sprout, Home, Heart } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Flame, label: 'Authentic\nIndian Flavors' },
  { icon: Sprout, label: 'Fresh & Quality\nIngredients' },
  { icon: Home, label: 'Warm & Cozy\nAmbience' },
  { icon: Heart, label: 'Made\nwith Love' },
]

export function About() {
  return (
    <section id="about" className="px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card p-5 clay md:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] clay-sm">
            <Image
              src="/images/interior.png"
              alt="Warm and cozy interior of Dimple Ki Rasoi restaurant"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-primary">
              ABOUT US
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight md:text-4xl">
              A Place Where{' '}
              <span className="text-primary">Taste</span> Meets{' '}
              <span className="text-accent">Tradition</span>
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              At Dimple Ki Rasoi, we bring the warmth of traditional Indian
              kitchens into a modern dining experience. Every dish is crafted
              with authentic recipes, handpicked ingredients, and a passion for
              real taste.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-clay-tint text-primary clay-sm">
                    <Icon className="size-6" />
                  </span>
                  <span className="whitespace-pre-line text-xs font-semibold leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
