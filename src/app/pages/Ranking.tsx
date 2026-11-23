import { Link } from "react-router";
import { ArrowLeft, Trophy, TrendingUp, Users, Crown } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";
import { useState } from "react";

interface UserStats {
  name: string;
  debatesParticipated: number;
  totalVotes: number;
  wins: number;
}

export function Ranking() {
  const { allDebates, messages } = useDebates();
  const [activeTab, setActiveTab] = useState<"debates" | "users">("debates");

  // Calculate debate rankings
  const debateRankings = [...allDebates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 20);

  // Calculate user statistics
  const userStatsMap = new Map<string, UserStats>();
  
  // Count participation and votes
  allDebates.forEach((debate) => {
    const user1Votes = debate.user1Votes || 0;
    const user2Votes = debate.user2Votes || 0;
    
    // User 1 stats
    if (!userStatsMap.has(debate.user1)) {
      userStatsMap.set(debate.user1, {
        name: debate.user1,
        debatesParticipated: 0,
        totalVotes: 0,
        wins: 0,
      });
    }
    const user1Stats = userStatsMap.get(debate.user1)!;
    user1Stats.debatesParticipated++;
    user1Stats.totalVotes += user1Votes;
    if (user1Votes > user2Votes) user1Stats.wins++;
    
    // User 2 stats
    if (!userStatsMap.has(debate.user2)) {
      userStatsMap.set(debate.user2, {
        name: debate.user2,
        debatesParticipated: 0,
        totalVotes: 0,
        wins: 0,
      });
    }
    const user2Stats = userStatsMap.get(debate.user2)!;
    user2Stats.debatesParticipated++;
    user2Stats.totalVotes += user2Votes;
    if (user2Votes > user1Votes) user2Stats.wins++;
  });

  const userRankings = Array.from(userStatsMap.values())
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 20);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-500";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="h-[88px] flex items-center px-5">
          <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-4 text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            Rankings
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex px-5 gap-2 pb-4">
          <button
            onClick={() => setActiveTab("debates")}
            className={`flex-1 py-3 rounded-[12px] font-medium text-[15px] transition-all duration-300 ${
              activeTab === "debates"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Debate Rankings
            </div>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-3 rounded-[12px] font-medium text-[15px] transition-all duration-300 ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 hover:bg-secondary"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              User Rankings
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-8">
        {/* Debate Rankings */}
        {activeTab === "debates" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
                Top 20 Debates
              </h2>
            </div>
            
            <div className="space-y-3">
              {debateRankings.map((debate, index) => {
                const rank = index + 1;
                const user1Votes = debate.user1Votes || 0;
                const user2Votes = debate.user2Votes || 0;
                const totalVotes = user1Votes + user2Votes;
                const user1Percentage = totalVotes > 0 ? Math.round((user1Votes / totalVotes) * 100) : 50;

                return (
                  <Link
                    key={debate.id}
                    to={`/debate/${debate.id}`}
                    className="premium-panel block p-5 hover:-translate-y-0.5 hover:border-primary/30"
                    style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-[20px] font-bold ${
                        rank <= 3 ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-secondary"
                      } ${getRankColor(rank)}`}>
                        {getRankIcon(rank)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold mb-2 line-clamp-1">
                          {debate.title}
                        </h3>
                        <p className="text-[14px] text-muted-foreground mb-3">
                          {debate.user1} vs {debate.user2}
                        </p>
                        
                        {/* Vote bar */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-[12px] mb-1">
                            <span className="text-primary">{user1Percentage}%</span>
                            <span className="text-muted-foreground">{totalVotes} votes</span>
                            <span className="text-muted-foreground">{100 - user1Percentage}%</span>
                          </div>
                          <div className="h-1 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${user1Percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Live indicator */}
                        {debate.isLive && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[12px] text-red-500 font-medium">Live</span>
                            <span className="text-[12px] text-muted-foreground ml-2">👁 {debate.viewers}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* User Rankings */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
                User Rankings
              </h2>
            </div>

            <div className="space-y-3">
              {userRankings.map((user, index) => {
                const rank = index + 1;
                const winRate = user.debatesParticipated > 0 
                  ? Math.round((user.wins / user.debatesParticipated) * 100)
                  : 0;

                return (
                  <div
                    key={user.name}
                    className="premium-panel p-5"
                    style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-[20px] font-bold ${
                        rank <= 3 ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-secondary"
                      } ${getRankColor(rank)}`}>
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-[18px] flex-shrink-0">
                        👤
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold mb-1">{user.name}</h3>
                        <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
                          <span>Debates: {user.debatesParticipated}</span>
                          <span>Win rate: {winRate}%</span>
                        </div>
                      </div>

                      {/* Total Votes */}
                      <div className="text-right">
                        <div className="text-[20px] font-bold text-primary">{user.totalVotes}</div>
                        <div className="text-[12px] text-muted-foreground">Votes received</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {userRankings.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-[16px]">No ranking data yet.</p>
                  <p className="text-[14px] mt-2">Join debates to appear in the rankings!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
