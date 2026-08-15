'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './logo'
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './whatsapp-icon'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Journey', href: '#journey' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#menu' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-card/85 px-4 py-3 backdrop-blur-md clay md:px-6">
        <a href="#home" aria-label="Dimple Ki Rasoi home">
          <Logo />
        </a>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  i === 0 ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.label}
                {i === 0 && (
                  <span className="mx-auto mt-0.5 block h-0.5 w-5 rounded-full bg-primary" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 lg:flex">
          {[InstagramIcon, FacebookIcon].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="Social link"
              className="flex size-9 items-center justify-center rounded-full bg-clay-tint text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <a
            href="#"
            aria-label="WhatsApp"
            className="flex size-9 items-center justify-center rounded-full bg-clay-tint text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <WhatsAppIcon className="size-4" />
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-xl bg-clay-tint text-primary lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl bg-card p-4 clay lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-clay-tint hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
