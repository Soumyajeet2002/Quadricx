import { CookingPot, Utensils, Building2, Users, ConciergeBell, Heart } from 'lucide-react'

const MILESTONES = [
  { year: '2005', icon: CookingPot, text: 'A small home kitchen with big dreams' },
  { year: '2008', icon: Utensils, text: 'Loved by many, growing through word of mouth' },
  { year: '2012', icon: Building2, text: 'First official outlet – a big milestone' },
  { year: '2016', icon: Users, text: 'Expanding our family of happy customers' },
  { year: '2020', icon: ConciergeBell, text: 'New look, same taste – stronger than ever' },
  { year: '2024+', icon: Heart, text: 'Continuing our journey with love & gratitude' },
]

export function Journey() {
  return (
    <section id="journey" className="px-4 pb-12 md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card p-6 clay md:p-10">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-primary">
            OUR JOURNEY
          </p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
            <span className="text-primary">19</span> Years of Taste, Trust &
            Togetherness
          </h2>
        </div>

        <div className="relative mt-10">
          {/* connecting line - desktop */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 border-t-2 border-dashed border-primary/30 md:block" />
          {/* connecting line - mobile (vertical) */}
          <div className="absolute bottom-0 left-7 top-0 w-0.5 border-l-2 border-dashed border-primary/30 md:hidden" />

          <ol className="relative grid gap-8 md:grid-cols-6 md:gap-4">
            {MILESTONES.map(({ year, icon: Icon, text }) => (
              <li
                key={year}
                className="flex items-start gap-4 md:flex-col md:items-center md:text-center"
              >
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-clay-tint text-primary clay-sm">
                  <Icon className="size-6" />
                </span>
                <div>
                  <p className="text-lg font-extrabold text-primary">{year}</p>
                  <p className="mt-1 max-w-[10rem] text-xs leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
