import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppStateProvider } from "./state/Context.tsx";
import { Container } from "@mui/material";
import AppRouter from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <Container maxWidth={"md"}>
        <AppRouter />
      </Container>
    </AppStateProvider>
  </StrictMode>,
);
