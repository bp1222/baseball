import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {RouterProvider} from "react-router-dom"

import {AppStateProvider} from "@/state"

import {ApplicationRouter} from "./Router.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <RouterProvider router={ApplicationRouter}/>
    </AppStateProvider>
  </StrictMode>,
)
