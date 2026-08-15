import { CookingPot } from 'lucide-react'

export function Logo({
  variant = 'default',
}: {
  variant?: 'default' | 'light'
}) {
  const isLight = variant === 'light'
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex size-11 items-center justify-center rounded-2xl ${
          isLight ? 'bg-white/15 text-white' : 'bg-primary text-primary-foreground clay-red'
        }`}
      >
        <CookingPot className="size-6" strokeWidth={2.2} />
      </div>
      <div className="leading-none">
        <p
          className={`text-[10px] font-medium tracking-[0.2em] ${
            isLight ? 'text-white/70' : 'text-muted-foreground'
          }`}
        >
          DIMPLE KI
        </p>
        <p
          className={`text-lg font-extrabold tracking-tight ${
            isLight ? 'text-white' : 'text-primary'
          }`}
        >
          RASOI
        </p>
      </div>
    </div>
  )
}
