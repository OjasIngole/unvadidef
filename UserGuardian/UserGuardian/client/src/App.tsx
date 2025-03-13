import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import Providers from "./providers";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/research" component={HomePage} />
      <ProtectedRoute path="/speech" component={HomePage} />
      <ProtectedRoute path="/debate" component={HomePage} />
      <ProtectedRoute path="/resolution" component={HomePage} />
      <ProtectedRoute path="/rules" component={HomePage} />
      <ProtectedRoute path="/documents" component={HomePage} />
      <ProtectedRoute path="/history" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Router />
        <Toaster />
      </Providers>
    </QueryClientProvider>
  );
}

export default App;
