 
import { Twitter, Instagram, Facebook, Github, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-transparent py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-3 tracking-wide">
          KickSpot
        </h3>
        <p className="text-gray-300 text-base md:text-lg mb-8">
          Premium footwear for the modern lifestyle
        </p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <a href="#" aria-label="Twitter" className="text-gray-200/70 hover:text-white transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Instagram" className="text-gray-200/70 hover:text-white transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Facebook" className="text-gray-200/70 hover:text-white transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" aria-label="Github" className="text-gray-200/70 hover:text-white transition-colors">
            <Github className="h-6 w-6" />
          </a>
          <a href="#" aria-label="YouTube" className="text-gray-200/70 hover:text-white transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
        </div>

        <p className="text-gray-400 text-xs">
          @ 2025 KickSpot.
        </p>
      </div>
    </footer>
  )
}
