import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Deals from "@/pages/deals";
import Leads from "@/pages/leads";
import Documents from "@/pages/documents";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/deals" component={Deals} />
      <Route path="/leads" component={Leads} />
      <Route path="/documents" component={Documents} />
      <Route path="/settings" component={Settings} />
      <Route path="/profile" component={Profile} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
