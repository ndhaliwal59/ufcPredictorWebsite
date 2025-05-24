import { Switch, Route } from "wouter";
import { AuthProvider } from "@/contexts/AuthContext";  
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import HowItWorks from "@/pages/HowItWorks";
import NotFound from "@/pages/not-found";
import LoginForm from '@/pages/LoginForm';
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRout";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={LoginForm} />
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
        <Route path="/" component={Home} />
        <Route path="/events" component={Events} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
