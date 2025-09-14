"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  const images = [
    '/1000315654.png',
    '/1000315655.png',
    '/1000315659.png',
    '/1000315660.png',
    '/1000315661.png',
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ align: 'center', loop: true, containScroll: 'trimSnaps' }}
      className="w-screen h-[40vh] md:h-[50vh] lg:h-[50vh] overflow-hidden bg-black"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="items-center -ml-0">
        {images.map((src, index) => (
          <CarouselItem
            key={index}
            className="rounded-2xl flex items-center justify-center select-none basis-[75vw] md:basis-[60vw] lg:basis-[50vw] pl-0"
          >
            <div className="relative h-[40vh] w-full overflow-hidden md:h-[50vh] lg:h-[60vh]">
              <img
                alt={`Carousel slide ${index + 1}`}
                className="block h-full w-full rounded-lg object-contain object-center bg-black"
                height={1024}
                loading="lazy"
                src={src}
                width={1024}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}


