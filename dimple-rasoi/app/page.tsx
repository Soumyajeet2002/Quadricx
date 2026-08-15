import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Journey } from '@/components/journey'
import { Owners } from '@/components/owners'
import { Dishes } from '@/components/dishes'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Journey />
      <Owners />
      <Dishes />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
