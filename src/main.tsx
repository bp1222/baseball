import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppStateProvider } from "./AppContext.tsx";

import App, { AppLoader } from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import TeamSchedule from "./components/TeamSchedule.tsx";
import { Container } from "@mui/material";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} loader={AppLoader}>
      <Route path="/">
        <Route path="schedule/:teamId" element={<TeamSchedule />} />
      </Route>
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <Container maxWidth="md">
        <RouterProvider router={router} />
      </Container>
    </AppStateProvider>
  </StrictMode>,
);
