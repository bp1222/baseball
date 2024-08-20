import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App, { AppLoader } from "./App";
import Team from "./components/Team";
import TeamSchedule from "./components/TeamSchedule";

const AppRouter = () => {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route element={<App />} loader={AppLoader}>
        <Route path="/">
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
