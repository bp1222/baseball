import {
  createHashRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import React from "react";

import App from "./App";
import Team from "./components/Team";
import TeamSchedule from "./components/TeamSchedule";
import TeamStats from "./components/TeamStats";

const AppRouter = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path=":seasonId" element={<Outlet />}>
          <Route path=":teamId" element={<Team />}>
            <Route index element={<TeamSchedule />} />
            <Route index path="stats" element={<TeamStats />} />
          </Route>
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
