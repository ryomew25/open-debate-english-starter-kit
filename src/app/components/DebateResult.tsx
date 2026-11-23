import { Trophy, Medal } from "lucide-react";
import { Debate } from "../contexts/DebateContext";

interface DebateResultProps {
  debate: Debate;
}

export function DebateResult({ debate }: DebateResultProps) {
  if (!debate.endedAt || !debate.winner) {
    return null;
  }

  const user1Votes = debate.user1Votes || 0;
  const user2Votes = debate.user2Votes || 0;

  return (
    <div className="premium-panel bg-primary/5 p-8 text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-[14px] mb-4 shadow-[0_5px_14px_rgba(125,94,31,0.13)]">
        <Trophy className="w-10 h-10 text-white" />
      </div>
      
      <h2 
        className="text-[28px] font-bold mb-2" 
        style={{ fontFamily: "var(--font-family-display)" }}
      >
        Debate ended
      </h2>
      
      {debate.winner === "draw" ? (
        <p className="text-[18px] text-muted-foreground mb-6">
          It's a draw
        </p>
      ) : (
        <p className="text-[18px] text-muted-foreground mb-6">
          <span className="text-primary font-semibold">
            {debate.winner === "user1" ? debate.user1 : debate.user2}
          </span>{" "}
          wins!
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        <div 
          className={`bg-card rounded-[16px] p-6 border-2 transition-all duration-300 ${
            debate.winner === "user1" 
              ? "border-primary scale-105" 
              : "border-border"
          }`}
        >
          {debate.winner === "user1" && (
            <div className="mb-3">
              <Medal className="w-8 h-8 text-primary mx-auto" />
            </div>
          )}
          <div className="text-[13px] text-muted-foreground mb-1">
            {debate.user1}
          </div>
          <div className="text-[32px] font-bold text-primary">
            {user1Votes}
          </div>
          <div className="text-[12px] text-muted-foreground">votes</div>
        </div>

        <div 
          className={`bg-card rounded-[16px] p-6 border-2 transition-all duration-300 ${
            debate.winner === "user2" 
              ? "border-primary scale-105" 
              : "border-border"
          }`}
        >
          {debate.winner === "user2" && (
            <div className="mb-3">
              <Medal className="w-8 h-8 text-primary mx-auto" />
            </div>
          )}
          <div className="text-[13px] text-muted-foreground mb-1">
            {debate.user2}
          </div>
          <div className="text-[32px] font-bold text-primary">
            {user2Votes}
          </div>
          <div className="text-[12px] text-muted-foreground">votes</div>
        </div>
      </div>
    </div>
  );
}
