import { Outlet, useLocation } from "react-router";
import { Navigation } from "../components/Navigation";
import { BottomNav } from "../components/BottomNav";

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="app-content pb-[72px] lg:ml-[232px] lg:pb-0">
        <div key={location.pathname} className="route-fade">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
