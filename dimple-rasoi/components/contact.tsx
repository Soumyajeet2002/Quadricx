'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './whatsapp-icon'

const DETAILS = [
  { icon: MapPin, text: '123, Food Street, Flavor Town, New Delhi – 110001' },
  { icon: Phone, text: '+91 98765 43210' },
  { icon: Mail, text: 'hello@dimplekirasoi.com' },
]

const inputClass =
  'w-full rounded-xl border-0 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground clay-inset outline-none focus:ring-2 focus:ring-primary/40'

export function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section id="contact" className="px-4 pb-12 md:px-6 md:pb-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-card p-6 clay md:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: details */}
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-primary">
              GET IN TOUCH
            </p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Enquiry / Contact Us
            </h2>

            <ul className="mt-7 flex flex-col gap-5">
              {DETAILS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground clay-red">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/80">
                    {text}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex gap-3">
              {[InstagramIcon, FacebookIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-11 items-center justify-center rounded-full bg-clay-tint text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="size-5" />
                </a>
              ))}
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex size-11 items-center justify-center rounded-full bg-clay-tint text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <WhatsAppIcon className="size-5" />
              </a>
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Your Name" className={inputClass} aria-label="Your Name" />
              <input required placeholder="Phone Number" className={inputClass} aria-label="Phone Number" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="email"
                required
                placeholder="Email Address"
                className={inputClass}
                aria-label="Email Address"
              />
              <input
                placeholder="No. of Persons (Optional)"
                className={inputClass}
                aria-label="Number of Persons"
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={5}
              className={`${inputClass} resize-none`}
              aria-label="Your Message"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground clay-red transition-transform hover:-translate-y-0.5"
            >
              {sent ? (
                <>
                  Enquiry Sent <Check className="size-4" />
                </>
              ) : (
                <>
                  Send Enquiry <Send className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
