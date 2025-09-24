// src/lib/api.ts
const BASE = import.meta.env.VITE_API_BASE_URL as string;

function assert(ok: boolean, msg: string) {
  if (!ok) throw new Error(msg);
}

export type Variant = "imported" | "ready";

export type Product = {
  id: number | string;
  sku: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  variant: Variant;
  active?: boolean;
  images?: { url: string; alt?: string | null }[] | string[];
};

export type ProductListResponse = {
  items: Product[];
  total: number;
};

export async function listProducts(opts: {
  variant?: Variant | "";
  q?: string;
  take?: number;
  skip?: number;
}): Promise<ProductListResponse> {
  const u = new URL("/api/public/products", BASE);
  if (opts.variant) u.searchParams.set("variant", opts.variant);
  if (opts.q) u.searchParams.set("q", opts.q);
  u.searchParams.set("take", String(opts.take ?? 12));
  u.searchParams.set("skip", String(opts.skip ?? 0));

  const res = await fetch(u, { method: "GET" });
  assert(res.ok, "Falha ao carregar produtos");
  const data = await res.json()
  console.log(data);
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const u = new URL("/api/public/products/by-slug", BASE);
  u.searchParams.set("slug", slug);
  const res = await fetch(u);
  if (res.status === 404) return null;
  assert(res.ok, "Falha ao carregar produto");
  return res.json();
}

export type QuoteItem = {
  sku: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export async function submitQuote(payload: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  variant: Variant;
  items: QuoteItem[];
  notes?: string;
}): Promise<{ ok: true; id: string | number }> {
  const res = await fetch(new URL("/api/public/quotes", BASE), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  assert(res.ok, "Falha ao enviar orçamento");
  return res.json();
}
