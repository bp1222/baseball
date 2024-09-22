import {StrictMode} from "react";
import { createRoot } from "react-dom/client";
import { Container } from "@mui/material";
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {AppStateProvider} from "./state/Context.tsx";

import App from "./App.tsx";
import Season from  "./components/Season.tsx";

const applicationRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path=":seasonId" element={<Season />}>
        <Route index lazy={() => import("./components/CurrentSeries")} />
        <Route path=":teamId" lazy={() => import("./components/team/Team")} />
      </Route>
    </Route>,
  ),
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container maxWidth={"md"}>
      <AppStateProvider>
        <RouterProvider router={applicationRoutes} />
      </AppStateProvider>
    </Container>
  </StrictMode>,
);
