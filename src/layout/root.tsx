// src/layouts/RootLayout.tsx
import { Outlet, ScrollRestoration, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/logo.png"
function Header() {
  return (
    <header role="banner" className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          {/* Dica: coloque o arquivo em public/logo.png */}
          <NavLink to="/" className="inline-flex items-center gap-2" aria-label="Ir para a página inicial">
            <img
              src={logo}
              alt="BM Imports"
              width={128}
              height={32}
              className="h-8 w-auto sm:h-9"
              loading="eager"
              decoding="async"
            />
          </NavLink>

          <nav aria-label="Navegação principal" className="flex items-center">
            <a
              href="https://www.bmimports.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium hover:underline focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
            >
              Voltar para o site
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer role="contentinfo" className="w-full bg-gray-900 text-white flex">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs sm:text-sm">
        © {new Date().getFullYear()} BM IMPORTS COMÉRCIO INTERNACIONAL LTDA. 
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-xs sm:text-sm">
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default function RootLayout() {
  return (
    <>
      <Helmet>
        <html lang="pt-BR" />
        <title>BM IMPORTS COMÉRCIO INTERNACIONAL LTDA</title>
        <meta
          name="description"
          content="Site institucional da BM IMPORTS COMÉRCIO INTERNACIONAL LTDA."
        />
        {/* Geralmente já está no index.html, mas não faz mal reforçar */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {/* Layout em coluna para o footer ficar colado no fim da página */}
      <div className="min-h-dvh flex flex-col">
        <Header />

        <main
          id="conteudo"
          role="main"
          className="flex-1 w-full"
        >
          <div className="mx-auto w-full ">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>

      {/* Restaura posição de scroll ao navegar */}
      <ScrollRestoration />
    </>
  );
}
