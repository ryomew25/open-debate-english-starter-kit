import { Link } from "react-router";
import { MessageSquare, Bookmark, History, Settings, Moon, Sun, ChevronRight, ArrowLeft, LogIn, Users, UserPlus, UserMinus } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useDebates } from "../contexts/DebateContext";
import { useAuth } from "../contexts/AuthContext";
import { useSocial } from "../contexts/SocialContext";
import { useEffect, useState } from "react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  rightContent?: React.ReactNode;
}

function MenuItem({ icon, label, to, onClick, rightContent }: MenuItemProps) {
  const content = (
    <div className="flex items-center justify-between py-4 px-5 bg-card border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-[16px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        {!rightContent && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

export function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { userDebates } = useDebates();
  const { user } = useAuth();
  const { getFollowers, getFollowing } = useSocial();
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    // Count user votes from localStorage
    const storedVotes = localStorage.getItem("userVotes");
    if (storedVotes) {
      try {
        const votes = JSON.parse(storedVotes);
        setVoteCount(votes.length);
      } catch (e) {
        console.error("Failed to load votes", e);
      }
    }
  }, []);

  // Format join date
  const joinDate = user?.joinedAt 
    ? new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const followers = user ? getFollowers(user.name) : [];
  const following = user ? getFollowing(user.name) : [];

  // Show sign-in prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen pb-12">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="h-[88px] flex items-center px-5">
            <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="ml-4 text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
              My Profile
            </h1>
          </div>
        </div>

        {/* Sign-in Required Message */}
        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <div className="bg-card rounded-[16px] p-12" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)" }}>
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-[24px] font-semibold mb-3" style={{ fontFamily: "var(--font-family-display)" }}>
              Sign in required
            </h2>
            <p className="text-[16px] text-muted-foreground mb-8">
              Please sign in to view your profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signin"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-[12px] text-[16px] font-medium hover:opacity-90 transition-opacity"
              >
                Sign in
              </Link>
              <Link
                to="/"
                className="px-6 py-3 bg-secondary text-foreground rounded-[12px] text-[16px] font-medium hover:bg-secondary/80 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="h-[88px] flex items-center px-5">
          <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-4 text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            My Profile
          </h1>
        </div>

        {/* Profile Info */}
        <div className="px-5 py-8 text-center">
          <div className="w-20 h-20 bg-primary/10 border border-primary/15 rounded-[20px] mx-auto mb-4 flex items-center justify-center">
            <span className="text-[26px] font-bold text-primary">{user.name.slice(0, 1).toUpperCase()}</span>
          </div>
          <h2 className="text-[20px] font-semibold mb-2">{user?.name || 'Guest User'}</h2>
          {joinDate && (
            <p className="text-[13px] text-muted-foreground">Joined: {joinDate}</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8">
        {/* Main Menu */}
        <section className="mb-8">
          <h3 className="text-[14px] font-medium text-muted-foreground mb-3 px-2">
            Menu
          </h3>
          <div className="premium-panel overflow-hidden">
            <MenuItem
              icon={<MessageSquare className="w-5 h-5" />}
              label="My Debates"
              to="/"
            />
            <MenuItem
              icon={<Bookmark className="w-5 h-5" />}
              label="Saved"
              to="/"
            />
            <MenuItem
              icon={<History className="w-5 h-5" />}
              label="Vote History"
              to="/"
            />
          </div>
        </section>

        {/* Settings */}
        <section>
          <h3 className="text-[14px] font-medium text-muted-foreground mb-3 px-2">
            Settings
          </h3>
          <div className="premium-panel overflow-hidden">
            <MenuItem
              icon={theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              label="Dark mode"
              onClick={toggleTheme}
              rightContent={
                <div className="relative inline-block w-12 h-6">
                  <div
                    className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                      theme === "dark" ? "bg-primary" : "bg-switch-background"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      theme === "dark" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              }
            />
            <MenuItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              to="/"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="premium-panel mt-8 p-6">
          <h3 className="text-[18px] font-semibold mb-4" style={{ fontFamily: "var(--font-family-display)" }}>
            Statistics
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-[24px] font-semibold text-primary mb-1">{userDebates.length}</div>
              <div className="text-[13px] text-muted-foreground">Debates created</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-semibold text-primary mb-1">{voteCount}</div>
              <div className="text-[13px] text-muted-foreground">Debates joined</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-semibold text-primary mb-1">{userDebates.reduce((sum, d) => sum + d.votes, 0)}</div>
              <div className="text-[13px] text-muted-foreground">Votes received</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-semibold text-primary mb-1">{followers.length}</div>
              <div className="text-[13px] text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-[24px] font-semibold text-primary mb-1">{following.length}</div>
              <div className="text-[13px] text-muted-foreground">Following</div>
            </div>
          </div>
        </section>

        {/* Version & Terms */}
        <div className="mt-12 text-center space-y-2">
          <div>
            <Link to="/terms" className="text-[13px] text-primary">
              Terms of Service
            </Link>
          </div>
          <div className="text-[13px] text-muted-foreground">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
