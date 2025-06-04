import { Switch, Route } from "wouter";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import HowItWorks from "@/pages/HowItWorks";
import NotFound from "@/pages/not-found";
import LoginForm from "@/pages/LoginForm";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRout";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        const data = await res.json();
        console.log("Backend warmed up:", data);
      } catch (error) {
        console.error("Error warming up backend:", error);
      }
    };
    pingBackend();
  }, []);

  return (
    <AuthProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={LoginForm} />
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/events" component={Events} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route component={NotFound} />
        </Switch>
    </AuthProvider>
  );
}

export default App;
