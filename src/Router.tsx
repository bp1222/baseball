import {createHashRouter} from "react-router-dom"

import {App} from "@/App.tsx"

export const ApplicationRouter = createHashRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        lazy: () => import("@/pages/Season"),
        path: ":seasonId",
        children: [
          {
            index: true,
            lazy: () => import("@/pages/CurrentDay"),
          },
          {
            path: ":teamId",
            lazy: () => import("@/pages/Team"),
          }
        ],
      }
    ],
  },
])
