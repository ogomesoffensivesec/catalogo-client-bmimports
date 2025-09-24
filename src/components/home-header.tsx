// src/components/HomeHeader.tsx

import headerImage from "@/assets/banner-home.jpg"
export function HomeHeader() {

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-red-950">
      {/* decoração discreta */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Texto / Ações */}
          <div className="space-y-5 text-white">
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
              Catálogo BM Imports
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Nosso <span className="text-white/90">Catálogo</span>
            </h1>

            <p className="max-w-xl text-sm/6 text-white/80 sm:text-base">
              Explore produtos <strong>à pronta entrega</strong> e{" "}
              <strong>importados</strong>. Solicite orçamento ou faça seu pedido
              online de forma rápida e prática.
            </p>

            {/* Ações principais */}
            {/* <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 shadow-md"
                onClick={onGoImported}
                aria-label="Ver produtos importados"
              >
                <ShoppingCart className="h-4 w-4" />
                Produtos importados
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-blue-950 hover:bg-white/90"
                onClick={onGoReady}
                aria-label="Ver produtos à pronta entrega"
              >
                Fazer pedido (pronta entrega)
              </Button>
            </div> */}

      
          </div>

          {/* Imagem */}
          <div className="relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
              <img
                src={headerImage}
                alt="Vitrine de produtos BM Imports"
                className="h-full w-full object-cover"
                loading="eager"
              />
              {/* overlay sutil para leitura do texto em telas pequenas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-transparent to-red-900/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default HomeHeader
