export type ProductVariant = "ready" | "imported"

export type UIProduct = {
  id: number | string
  sku: string
  name: string
  description?: string | null
  seoDescription?: string | null
  images?: Array<string | { url: string; alt?: string | null }>
  price: number | string
  active?: boolean
}