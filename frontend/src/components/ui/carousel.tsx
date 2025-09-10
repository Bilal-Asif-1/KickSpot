"use client"

import * as React from "react"
import useEmblaCarousel, { type EmblaViewportRefType } from "embla-carousel-react"
import type { EmblaOptionsType } from "embla-carousel"
import { cn } from "@/lib/utils"

const CarouselContext = React.createContext<{
  viewportRef: EmblaViewportRefType
  api: ReturnType<typeof useEmblaCarousel>[1] | undefined
} | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error("useCarousel must be used within <Carousel>")
  return ctx
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: EmblaOptionsType
  plugins?: any[]
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, opts, plugins, ...props }, ref) => {
    const [viewportRef, api] = useEmblaCarousel(opts, plugins)

    return (
      <CarouselContext.Provider value={{ viewportRef, api }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          <div className="overflow-hidden" ref={viewportRef}>
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-ml-4 flex touch-pan-y", className)} {...props} />
))
CarouselContent.displayName = "CarouselContent"

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 shrink-0 grow-0 basis-full", className)} {...props} />
))
CarouselItem.displayName = "CarouselItem"

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel()
  return (
    <button
      ref={ref}
      type="button"
      className={cn("absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded bg-white/70 px-2 py-1", className)}
      onClick={() => api?.scrollPrev()}
      {...props}
    >
      Prev
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { api } = useCarousel()
  return (
    <button
      ref={ref}
      type="button"
      className={cn("absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded bg-white/70 px-2 py-1", className)}
      onClick={() => api?.scrollNext()}
      {...props}
    >
      Next
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"


