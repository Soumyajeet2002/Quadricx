import Image from 'next/image'
import { ArrowRight, ShoppingBag, Leaf, ChefHat, ShieldCheck, Heart } from 'lucide-react'

const FEATURES = [
  { icon: Leaf, label: 'Fresh\nIngredients' },
  { icon: ChefHat, label: 'Authentic\nRecipes' },
  { icon: ShieldCheck, label: 'Hygienic\nKitchen' },
  { icon: Heart, label: 'Made\nwith Love' },
]

export function Hero() {
  return (
    <section id="home" className="px-4 pt-8 md:px-6 md:pt-12">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
        {/* Left */}
        <div className="order-2 lg:order-1">
          <p className="font-script text-2xl text-accent md:text-3xl">
            Swad jo yaad rahe...
          </p>
          <h1 className="mt-1 text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl">
            DIMPLE KI
            <span className="mt-1 block text-primary md:text-8xl">RASOI</span>
          </h1>
          <p className="mt-4 text-lg font-medium text-foreground/90">
            Authentic Taste. Modern Experience.
          </p>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Experience the perfect blend of tradition, flavor and hospitality —
            crafted fresh every single day.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground clay-red transition-transform hover:-translate-y-0.5"
            >
              Explore Menu
              <span className="flex size-6 items-center justify-center rounded-full bg-white/20">
                <ArrowRight className="size-3.5" />
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-card px-6 py-3.5 text-sm font-semibold text-foreground clay-sm transition-transform hover:-translate-y-0.5"
            >
              Order Now
              <ShoppingBag className="size-4 text-primary" />
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] clay">
            <Image
              src="/images/hero-dish.png"
              alt="Signature creamy paneer butter masala served in a rustic bowl"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating vertical feature card */}
          <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 flex-col gap-4 rounded-3xl bg-card/90 p-4 backdrop-blur-md clay sm:flex md:right-0 md:-mr-4">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground clay-red">
                  <Icon className="size-4" />
                </span>
                <span className="whitespace-pre-line text-xs font-semibold leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile feature row */}
        <div className="order-3 grid grid-cols-4 gap-2 sm:hidden">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-2.5 text-center clay-sm"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-4" />
              </span>
              <span className="whitespace-pre-line text-[10px] font-semibold leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
