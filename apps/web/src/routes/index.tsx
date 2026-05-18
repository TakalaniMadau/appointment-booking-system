import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/app-shell";
import { HomePage } from "../pages/home-page";
import { NotFoundPage } from "../pages/not-found-page";

export const appRouter = createBrowserRouter([
  {
    element: <AppShell />,
    path: "/",
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <NotFoundPage />,
        path: "*",
      },
    ],
  },
]);
