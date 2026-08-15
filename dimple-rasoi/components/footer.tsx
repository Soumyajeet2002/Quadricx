'use client'

import { Send } from 'lucide-react'
import { Logo } from './logo'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './whatsapp-icon'

const QUICK_LINKS = ['Home', 'About Us', 'Our Journey', 'Menu', 'Gallery', 'Testimonials', 'Contact Us']

export function Footer() {
  return (
    <footer className="bg-primary px-4 pt-12 text-primary-foreground md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 pb-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Authentic Taste. Modern Experience.
            </p>
            <div className="mt-5 flex gap-3">
              {[InstagramIcon, FacebookIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex size-10 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white hover:text-primary"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Opening Hours</h3>
            <div className="mt-4 flex flex-col gap-4 text-sm text-white/70">
              <div>
                <p className="font-semibold text-white">Monday – Friday</p>
                <p>11:00 AM – 11:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white">Saturday – Sunday</p>
                <p>10:00 AM – 12:00 AM</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Newsletter</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Subscribe to get updates on our latest offers and dishes.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2 rounded-full bg-white/15 p-1.5 pl-4"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email for newsletter"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary transition-transform hover:scale-105"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/15 py-6 text-center text-xs text-white/60">
          © 2024 Dimple Ki Rasoi. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
