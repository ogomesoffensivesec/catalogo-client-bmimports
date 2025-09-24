// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "./layout/root";
import CheckoutPage from "./pages/checkout";

const Home = lazy(() => import("./pages/home"));
const NotFound = lazy(() => import("./pages/not_found"));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "*", element: <NotFound /> },
      {
        path: "/checkout", element: <CheckoutPage/>
      }
    ],
  },
]);
