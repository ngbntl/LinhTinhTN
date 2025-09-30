import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import "./index.css";
import "./lib/changeLanguageUtils";

const queryClient = new QueryClient();

const Root = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
      <Analytics />
    </QueryClientProvider>
  </StrictMode>
);
