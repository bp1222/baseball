import {
  createHashRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import TeamSchedule from "./components/TeamSchedule";
import Team from "./components/Team";

const AppRouter = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path=":seasonId" element={<Outlet />}>
          <Route path=":teamId" element={<Team />}>
            <Route path="schedule" element={<TeamSchedule />} />
          </Route>
        </Route>
      </Route>,
    ),
  );

  return <RouterProvider router={router} />;
};

export default AppRouter;
