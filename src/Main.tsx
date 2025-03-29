import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

import {ApplicationRouter} from "@/Router.tsx"
import {AppStateProvider} from "@/state/provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <ApplicationRouter/>
    </AppStateProvider>
  </StrictMode>,
)
