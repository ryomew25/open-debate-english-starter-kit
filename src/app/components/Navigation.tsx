import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { User, Search, LogOut, Shield, Bell, Swords, Trophy, Plus, Compass, Scale, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useDebates } from "../contexts/DebateContext";
import { useSocial } from "../contexts/SocialContext";
import { NotificationPanel } from "./NotificationPanel";
import { InvitationDialog } from "./InvitationDialog";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getReports, allDebates } = useDebates();
  const { getUnreadCount } = useSocial();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    setProfileMenuOpen(false);
  };

  const handleSearchSelect = (debateId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/debate/${debateId}`);
  };

  // Simple admin check
  const isAdmin = user?.name === "Admin";
  const pendingReportsCount = getReports().filter(r => r.status === "pending").length;
  const unreadCount = getUnreadCount();

  const filteredDebates = searchQuery
    ? allDebates.filter(
        (debate) =>
          debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.user1.toLowerCase().includes(searchQuery.toLowerCase()) ||
          debate.user2.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const sideLinks = [
    { to: "/", label: "Discover", icon: Compass },
    { to: "/ranking", label: "Rankings", icon: Trophy },
    { to: "/create", label: "Create Debate", icon: Plus },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="h-full flex items-center justify-between px-5 lg:px-6">
          <Link to="/" className="flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.03em]">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-primary-foreground shadow-none">
              <Scale className="h-[17px] w-[17px]" strokeWidth={2.4} />
            </span>
            Open Debate
          </Link>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 hover:bg-secondary rounded-[10px] text-muted-foreground hover:text-foreground"
            >
              <Search className="w-5 h-5" />
            </button>

            {user && (
              <>
                <button
                  onClick={() => setInvitationOpen(true)}
                  className="hidden sm:block p-2.5 hover:bg-secondary rounded-[10px] text-muted-foreground hover:text-foreground"
                  title="Send a debate invitation"
                >
                  <Swords className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setNotificationOpen(true)}
                  className="p-2.5 hover:bg-secondary rounded-[10px] text-muted-foreground hover:text-foreground relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="ml-1 flex h-9 min-w-9 items-center justify-center rounded-[10px] bg-secondary px-2.5 text-primary"
                >
                  <span className="text-[13px] font-bold">{user.name.slice(0, 1).toUpperCase()}</span>
                </button>
                
                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <div
                      className="absolute right-0 mt-2 w-56 bg-card rounded-[12px] shadow-lg z-50 overflow-hidden"
                      style={{ boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" }}
                    >
                      <div className="p-4 border-b border-border">
                        <p className="text-[14px] font-semibold">{user?.name}</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Account</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-[15px]">Profile</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="text-[15px]">Admin panel</span>
                          {pendingReportsCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-[12px] rounded-full">
                              {pendingReportsCount}
                            </span>
                          )}
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left border-t border-border"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-[15px]">Sign out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/signin"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-[12px] text-[14px] font-medium hover:opacity-90 transition-opacity"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-[232px] border-r border-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex-1 px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Navigation</p>
          <div className="space-y-1">
            {sideLinks.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? isActive("/") : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" strokeWidth={active ? 2.3 : 1.8} />
                  {label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>

          <p className="mb-2 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          <button onClick={() => setSearchOpen(true)} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Search className="h-[17px] w-[17px]" /> Search debates
          </button>
          {user && (
            <>
              <button onClick={() => setInvitationOpen(true)} className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
                <Swords className="h-[17px] w-[17px]" /> Send invitation
              </button>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Shield className="h-[17px] w-[17px]" /> Admin panel
                </Link>
              )}
            </>
          )}
        </div>
        <div className="border-t border-border p-3">
          <Link to={user ? "/profile" : "/signin"} className="flex items-center gap-3 rounded-[12px] p-2.5 hover:bg-secondary">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10 text-[13px] font-bold text-primary">
              {user ? user.name.slice(0, 1).toUpperCase() : <User className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">{user?.name || "Guest"}</span>
              <span className="block text-[11px] text-muted-foreground">{user ? "Member" : "Sign in"}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </aside>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1220]/35 backdrop-blur-[3px]" onClick={() => setSearchOpen(false)}>
          <div className="max-w-2xl mx-auto mt-20 px-5" onClick={(e) => e.stopPropagation()}>
            <div className="premium-panel overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
              {/* Search Input */}
              <div className="p-5 border-b border-border">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search debates..."
                  className="w-full bg-transparent text-[18px] focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {searchQuery && filteredDebates.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No results found.
                  </div>
                )}
                {searchQuery && filteredDebates.map((debate) => (
                  <button
                    key={debate.id}
                    onClick={() => handleSearchSelect(debate.id)}
                    className="w-full p-5 border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors duration-300 text-left"
                  >
                    <h3 className="text-[16px] font-semibold mb-1">{debate.title}</h3>
                    <p className="text-[14px] text-muted-foreground">
                      {debate.user1} vs {debate.user2}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-muted-foreground">
                      {debate.isLive && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-red-500">Live</span>
                        </div>
                      )}
                      <span>🗳 {debate.votes}</span>
                    </div>
                  </button>
                ))}
                {!searchQuery && (
                  <div className="p-8 text-center text-muted-foreground">
                    Search by debate title or username.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Panel */}
      <NotificationPanel isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />

      {/* Invitation Dialog */}
      <InvitationDialog open={invitationOpen} onOpenChange={setInvitationOpen} />
    </>
  );
}
