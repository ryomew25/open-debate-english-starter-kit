import { Link, useLocation } from "react-router";
import { Home, Search, Plus, Trophy, User } from "lucide-react";

const TABS = [
  { path: "/", label: "Home", icon: Home, exact: true },
  { path: "/ranking", label: "Rankings", icon: Trophy, exact: false },
  { path: "/create", label: "Create", icon: Plus, exact: false },
  { path: "/profile", label: "Profile", icon: User, exact: false },
];

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch h-[56px] max-w-lg mx-auto">
        {TABS.map(({ path, label, icon: Icon, exact }) => {
          const active = isActive(path, exact);
          const isCreate = path === "/create";

          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center gap-[3px] relative"
            >
              {isCreate ? (
                <span className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-primary shadow-[0_3px_9px_rgba(125,94,31,0.14)]">
                  <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </span>
              ) : (
                <>
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
