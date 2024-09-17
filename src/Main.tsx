import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Container } from "@mui/material";
import {createHashRouter, createRoutesFromElements, Outlet, Navigate, Route, RouterProvider} from "react-router-dom";
import App from "./App.tsx";
import Team from "./components/Team.tsx";
import TeamSchedule from "./components/TeamSchedule.tsx";
import TeamStats from "./components/TeamStats.tsx";
import {AppStateProvider} from "./state/Context.tsx";
import Season from "./components/Season.tsx";

const applicationRoutes = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path=":seasonId" element={<Season />}>
        <Route index element={<Outlet />} />
        <Route path=":teamId" element={<Team />}>
          <Route index element={<Navigate to={"schedule"} />} />
          <Route path="schedule" element={<TeamSchedule />} />
          <Route path="stats" element={<TeamStats />} />
        </Route>
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
