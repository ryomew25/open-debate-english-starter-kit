import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, LogIn, Users, UserPlus } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { CATEGORIES } from "../constants/categories";

export function CreateDebate() {
  const navigate = useNavigate();
  const { addDebate, canCreateDebate } = useDebates();
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"recruit" | "fixed">("recruit");
  const [mySide, setMySide] = useState<"user1" | "user2">("user1");
  const [user1Name, setUser1Name] = useState("");
  const [user2Name, setUser2Name] = useState("");
  const [category, setCategory] = useState("Other");
  const [duration, setDuration] = useState(30);
  const [cooldownTime, setCooldownTime] = useState<number | null>(null);


  const durations = [15, 30, 45, 60, 90, 120];

  // Check cooldown periodically
  useEffect(() => {
    const checkCooldown = () => {
      const result = canCreateDebate();
      if (!result.allowed && result.waitTime) {
        setCooldownTime(result.waitTime);
      } else {
        setCooldownTime(null);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [canCreateDebate]);

  const handleStart = () => {
    const cooldownCheck = canCreateDebate();
    if (!cooldownCheck.allowed) {
      toast.error(`To prevent spam, you can create another debate in ${cooldownCheck.waitTime} seconds.`);
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a debate topic.");
      return;
    }

    if (mode === "recruit") {
      // Recruit mode: only creator's name is needed
      const debateId = addDebate({
        title: topic.trim(),
        user1: mySide === "user1" ? user!.name : "Open to join",
        user2: mySide === "user2" ? user!.name : "Open to join",
        isLive: false,
        viewers: 0,
        votes: 0,
        category,
        duration,
        user1Votes: 0,
        user2Votes: 0,
        openToJoin: true,
        creator: user!.name,
        creatorSide: mySide,
      });
      toast.success("Debate created. It is now open for participants.");
      navigate(`/debate/${debateId}`);
    } else {
      // Fixed mode: both names required
      if (!user1Name.trim() || !user2Name.trim()) {
        toast.error("Please enter the names of both participants.");
        return;
      }

      const debateId = addDebate({
        title: topic.trim(),
        user1: user1Name.trim(),
        user2: user2Name.trim(),
        isLive: true,
        viewers: 0,
        votes: 0,
        category,
        duration,
        startedAt: Date.now(),
        user1Votes: 0,
        user2Votes: 0,
        creator: user!.name,
      });
      toast.success("Debate started.");
      navigate(`/debate/${debateId}`);
    }
  };

  // Show sign-in prompt if not logged in
  if (!user) {
    return (
      <div className="min-h-screen pb-12">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border h-[88px] flex items-center px-5">
          <Link
            to="/"
            className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1
            className="ml-4 text-[20px] font-semibold"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Create Debate
          </h1>
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
              You need to sign in to create a debate.
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
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border h-[88px] flex items-center px-5">
        <Link
          to="/"
          className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1
          className="ml-4 text-[20px] font-semibold"
          style={{ fontFamily: "var(--font-family-display)" }}
        >
          Create a New Debate
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8 lg:pt-10">
        <div className="premium-panel p-5 sm:p-8">
        {/* Mode Selection */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium mb-4 text-muted-foreground">
            Debate Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("recruit")}
              className={`p-4 rounded-[16px] border-2 transition-all duration-300 ${
                mode === "recruit"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-secondary/30"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <UserPlus className={`w-6 h-6 ${mode === "recruit" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="text-[15px] font-semibold mb-1">Open Recruitment</div>
              <div className="text-[12px] text-muted-foreground">
                The first person to join can take the open side.
              </div>
            </button>
            <button
              onClick={() => setMode("fixed")}
              className={`p-4 rounded-[16px] border-2 transition-all duration-300 ${
                mode === "fixed"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-secondary/30"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Users className={`w-6 h-6 ${mode === "fixed" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="text-[15px] font-semibold mb-1">Fixed Participants</div>
              <div className="text-[12px] text-muted-foreground">
                Specify both participants in advance.
              </div>
            </button>
          </div>
        </div>

        {/* Topic Input */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium mb-3 text-muted-foreground">
            Debate Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your debate topic"
            className="w-full bg-card border border-border rounded-[16px] px-5 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            style={{ height: "120px" }}
          />
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium mb-4 text-muted-foreground">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`py-3 px-4 rounded-[12px] text-[14px] font-medium transition-all duration-300 text-left flex items-center gap-2 ${
                  category === cat.id
                    ? "bg-primary text-primary-foreground scale-[1.02]"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-8">
          <label className="block text-[14px] font-medium mb-4 text-muted-foreground">
            Duration
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {durations.map((dur) => (
              <button
                key={dur}
                onClick={() => setDuration(dur)}
                className={`py-3 px-4 rounded-[12px] text-[14px] font-medium transition-all duration-300 ${
                  duration === dur
                    ? "bg-primary text-primary-foreground scale-[1.02]"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                {dur} min
              </button>
            ))}
          </div>
        </div>

        {/* My Side Selection (Recruit Mode) */}
        {mode === "recruit" && (
          <div className="mb-8">
            <label className="block text-[14px] font-medium mb-4 text-muted-foreground">
              Your Position
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMySide("user1")}
                className={`py-3 px-4 rounded-[12px] text-[14px] font-medium transition-all duration-300 ${
                  mySide === "user1"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                For
              </button>
              <button
                onClick={() => setMySide("user2")}
                className={`py-3 px-4 rounded-[12px] text-[14px] font-medium transition-all duration-300 ${
                  mySide === "user2"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Against
              </button>
            </div>
          </div>
        )}

        {/* User Names (Fixed Mode) */}
        {mode === "fixed" && (
          <div className="mb-8 space-y-4">
            <div>
              <label className="block text-[14px] font-medium mb-2 text-muted-foreground">
                Participant 1 (For)
              </label>
              <input
                type="text"
                value={user1Name}
                onChange={(e) => setUser1Name(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-card border border-border rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium mb-2 text-muted-foreground">
                Participant 2 (Against)
              </label>
              <input
                type="text"
                value={user2Name}
                onChange={(e) => setUser2Name(e.target.value)}
                placeholder="e.g. Taylor Smith"
                className="w-full bg-card border border-border rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {topic && (
          <div className="mb-8 bg-card rounded-[16px] p-6 border border-border">
            <div className="text-[14px] text-muted-foreground mb-2">
              Preview
            </div>
            <div className="mb-2 inline-block bg-primary/10 text-primary px-3 py-1 rounded-[6px] text-[12px] font-medium">
              {category}
            </div>
            <h3
              className="text-[18px] font-semibold mb-2"
              style={{
                fontFamily: "var(--font-family-display)",
              }}
            >
              {topic}
            </h3>
            <p className="text-[14px] text-muted-foreground">
              {mode === "recruit"
                ? `${user!.name} vs Open to join`
                : `${user1Name || "Participant 1"} vs ${user2Name || "Participant 2"}`}
            </p>
            {mode === "recruit" && (
              <div className="mt-3 text-[13px] text-primary flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                The first person to join can take the open side.
              </div>
            )}
          </div>
        )}

        {/* Cooldown Warning */}
        {cooldownTime !== null && cooldownTime > 0 && (
          <div className="mb-4 bg-orange-500/10 border border-orange-500/20 rounded-[12px] px-4 py-3">
            <p className="text-[14px] text-orange-600 dark:text-orange-400">
              To prevent spam, you can create another debate in {cooldownTime} seconds.
            </p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={
            !topic.trim() ||
            (mode === "fixed" && (!user1Name.trim() || !user2Name.trim())) ||
            (cooldownTime !== null && cooldownTime > 0)
          }
          className="w-full bg-primary text-primary-foreground py-4 rounded-[12px] font-medium hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
          style={{ height: "50px" }}
        >
          {mode === "recruit" ? "Open for Participants" : "Start Debate"}
        </button>
        </div>
        </div>
    </div>
  );
}
