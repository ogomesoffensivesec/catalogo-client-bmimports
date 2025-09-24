import { Helmet } from "react-helmet-async";
export default function NotFound() {
  return (
    <>
      <Helmet><title>404 — Página não encontrada</title></Helmet>
      <h1>404</h1>
      <p>A página que você procura não existe.</p>
    </>
  );
}