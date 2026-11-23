import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/ThemeProvider";
import { DebateProvider } from "./contexts/DebateContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SocialProvider } from "./contexts/SocialContext";
import { Toaster } from "./components/ui/sonner";

// Open Debate - interactive debate platform
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocialProvider>
          <DebateProvider>
            <RouterProvider router={router} />
            <Toaster />
          </DebateProvider>
        </SocialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}