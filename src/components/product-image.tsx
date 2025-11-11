// src/components/product-image.tsx
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react' // Importe o CircleLoader

type Props = {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`
          h-full w-full object-cover
          transition-opacity duration-300
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true)
        }}
      />

    </div>
  )
}