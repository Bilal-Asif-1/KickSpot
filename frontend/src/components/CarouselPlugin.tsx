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
    '/shoe1-removebg-preview.png',
    '/shoe2-removebg-preview.png',
    '/shoe3-removebg-preview.png',
    '/shoe4-removebg-preview.png',
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{ align: 'center', loop: true, containScroll: 'trimSnaps' }}
      className="w-screen h-screen overflow-visible"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="items-center">
        {images.map((src, index) => (
          <CarouselItem
            key={index}
            className="rounded-2xl flex items-center justify-center select-none basis-[75vw] md:basis-[60vw] lg:basis-[50vw] pr-5"
          >
            <div className="relative h-[60vh] w-full overflow-hidden md:h-[65vh] lg:h-[70vh]">
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
      <CarouselPrevious className="left-4 z-20" />
      <CarouselNext className="right-4 z-20" />
    </Carousel>
  )
}


