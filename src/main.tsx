import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppStateProvider } from "./state/context.tsx";
import { Container } from "@mui/material";
import AppRouter from "./router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <Container>
        <AppRouter />
      </Container>
    </AppStateProvider>
  </StrictMode>,
);
