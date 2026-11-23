import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function SignIn() {
  const { user, setUsername } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Your name must be at least 2 characters long.");
      return;
    }

    setUsername(name);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[15px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-[16px] mb-4">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 
            className="text-[32px] font-semibold mb-2" 
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            Open Debate
          </h1>
          <p className="text-[17px] text-muted-foreground">
            Open Debate Platform
          </p>
        </div>

        {/* Name Entry Card */}
        <div
          className="bg-card rounded-[16px] p-6 md:p-8"
          style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="mb-6">
            <h2 className="text-[20px] font-semibold mb-2">Choose a name</h2>
            <p className="text-[15px] text-muted-foreground">
              Choose a nickname and join the discussion instantly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[15px]">
                Nickname
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="h-12 rounded-[12px] text-[17px]"
                autoFocus
                required
                maxLength={20}
              />
              <p className="text-[13px] text-muted-foreground">
                Enter 2–20 characters.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-[12px] px-4 py-3">
                <p className="text-[14px] text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-[12px] text-[17px] font-semibold"
            >
              Join now
            </Button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <p className="text-[13px] text-muted-foreground">
                ✓ No email address or password required
              </p>
              <p className="text-[13px] text-muted-foreground">
                ✓ Use a nickname and avoid sharing sensitive information
              </p>
              <p className="text-[13px] text-muted-foreground">
                ✓ Your data is saved in this browser, so you can continue with the same name next time
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-[13px] text-muted-foreground">
            Get started with a simple, convenient way to join the debate.
          </p>
          <p className="text-[13px] text-muted-foreground">
            By joining, you agree to our
            <Link to="/terms" className="text-primary underline underline-offset-2 mx-1">
              Terms of Service
            </Link>
            
          </p>
        </div>
      </div>
    </div>
  );
}