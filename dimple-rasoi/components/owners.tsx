import Image from 'next/image'
import { ConciergeBell } from 'lucide-react'

const OWNERS = [
  {
    name: 'DIMPLE',
    role: 'Co-Founder & Chef',
    img: '/images/dimple.png',
    desc: 'The heart behind every recipe. Crafting flavors that feel like home.',
  },
  {
    name: 'NARESH',
    role: 'Co-Founder & Manager',
    img: '/images/naresh.png',
    desc: 'Passionate about creating memorable experiences for every guest.',
  },
]

export function Owners() {
  return (
    <section className="px-4 pb-12 md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-bold tracking-[0.25em] text-primary">
          OUR OWNERS
        </p>

        <div className="relative mt-6 grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
          {OWNERS.map((owner) => (
            <div
              key={owner.name}
              className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-clay-tint to-card p-5 clay"
            >
              <div className="flex items-center gap-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/20 md:size-28">
                  <Image
                    src={owner.img || '/placeholder.svg'}
                    alt={`Portrait of ${owner.name}`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-primary">
                    {owner.name}
                  </h3>
                  <p className="text-sm font-semibold text-foreground/70">
                    {owner.role}
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {owner.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* center divider bell */}
          <div className="absolute left-1/2 top-1/2 hidden size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground clay-red md:flex">
            <ConciergeBell className="size-6" />
          </div>
        </div>
      </div>
    </section>
  )
}
