import {createRoot} from "react-dom/client"

import {ApplicationRouter} from "@/Router.tsx"
import {AppStateProvider} from "@/state/provider.tsx"

createRoot(document.getElementById("root")!).render(
  <AppStateProvider>
    <ApplicationRouter/>
  </AppStateProvider>
)
