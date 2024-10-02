import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { AppStateProvider } from "./state/Context.tsx";

const applicationRoutes = createHashRouter(
  createRoutesFromElements(
    <Route path="/" lazy={() => import('./App.tsx')}>
      <Route path=":seasonId" lazy={() => import('./components/Season.tsx')}>
        <Route index lazy={() => import('./components/CurrentDay.tsx')} />
        <Route path=":teamId" lazy={() => import("./components/team/Team")} />
      </Route>
    </Route>,
  ),
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <RouterProvider router={applicationRoutes} />
    </AppStateProvider>
  </StrictMode>,
);
