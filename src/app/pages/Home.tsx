import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserPlus, Flame, Search, SlidersHorizontal, ArrowUpRight, Plus, MessageSquare, Radio, Vote, Sparkles } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { CATEGORIES, getCategoryMeta } from "../constants/categories";

const ALL = "All";

export function Home() {
  const { userDebates, allDebates, joinDebate } = useDebates();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const filterByCategory = <T extends { category?: string; title?: string; user1?: string; user2?: string }>(list: T[]) =>
    list.filter((d) => {
      const inCategory = activeCategory === ALL || getCategoryMeta(d.category || "Other").id === activeCategory;
      const text = `${d.title || ""} ${d.user1 || ""} ${d.user2 || ""}`.toLowerCase();
      return inCategory && text.includes(query.trim().toLowerCase());
    });

  const openDebates = filterByCategory(allDebates.filter((d) => d.openToJoin === true));
  const liveDebates = filterByCategory(
    allDebates.filter((d) => d.isLive && !d.openToJoin)
  ).slice(0, 6);
  const popularDebates = filterByCategory(
    allDebates.filter((d) => !d.isUserCreated).sort((a, b) => b.votes - a.votes)
  ).slice(0, 6);

  const handleJoinDebate = (debateId: string) => {
    if (!user) {
      toast.error("Please sign in to join this debate.");
      navigate("/signin");
      return;
    }
    const success = joinDebate(debateId);
    if (success) {
      toast.success("You joined the debate!");
      navigate(`/debate/${debateId}`);
    } else {
      toast.error("Unable to join this debate.");
    }
  };

  const filterTabs = [ALL, ...CATEGORIES.map((c) => c.id)];

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-7 sm:px-7 lg:px-9 lg:pt-9">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Discover
          </div>
          <h1 className="text-[27px] font-bold tracking-[-0.035em] sm:text-[31px]">Open Debate</h1>
          <p className="mt-1.5 max-w-xl text-[14px] leading-6 text-muted-foreground">
            Explore topics that interest you and discover different perspectives.
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Sample discussions are included for preview. Your activity is saved only in this browser.
          </p>
        </div>
        <Link to="/create" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[12px] bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-[0_5px_14px_rgba(125,94,31,0.13)] hover:-translate-y-0.5 hover:bg-primary/90 sm:self-auto">
          <Plus className="h-4 w-4" /> New Debate
        </Link>
      </div>

      <div className="premium-panel mb-5 flex items-center gap-3 px-4 py-3">
        <Search className="h-[18px] w-[18px] text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search debates by topic, participant, or keyword"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
        />
        <span className="hidden rounded-md border border-border bg-secondary px-2 py-1 text-[10px] text-muted-foreground sm:block">⌘ K</span>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-5 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1" style={{ width: "max-content" }}>
          {filterTabs.map((tab) => {
            const meta = tab === ALL ? null : getCategoryMeta(tab);
            const active = activeCategory === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border text-[12px] font-semibold whitespace-nowrap ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {meta && <span>{meta.emoji}</span>}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
      <main className="min-w-0">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-5">
          <button className="relative text-[13px] font-semibold text-foreground after:absolute after:-bottom-[13px] after:left-0 after:h-0.5 after:w-full after:bg-primary">Feed</button>
          <button className="text-[13px] font-medium text-muted-foreground">Live</button>
          <button className="text-[13px] font-medium text-muted-foreground">Latest</button>
        </div>
        <button className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
        </button>
      </div>

      {/* Open to Join */}
      {openDebates.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-[20px] font-semibold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Open for Participants
            </h2>
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-4">
              {openDebates.map((debate) => {
                const meta = getCategoryMeta(debate.category || "Other");
                return (
                  <div
                    key={debate.id}
                    className="premium-panel flex-shrink-0 w-[300px] p-5 border-primary/20"
                  >
                    <div className="flex flex-col h-full gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-[6px] text-[11px] font-semibold mb-2">
                          {meta.emoji} {meta.label}
                        </span>
                        <h3
                          className="text-[15px] font-semibold line-clamp-2"
                          style={{ fontFamily: "var(--font-family-display)" }}
                        >
                          {debate.title}
                        </h3>
                        <p className="text-[12px] text-muted-foreground mt-1">
                          Created by: {debate.creator}
                        </p>
                      </div>
                      <button
                        onClick={() => handleJoinDebate(debate.id)}
                        disabled={!user || debate.creator === user?.name}
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-[10px] text-[14px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {!user
                          ? "Sign in to join"
                          : debate.creator === user?.name
                          ? "Your debate"
                          : "Join"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Live Now */}
      {liveDebates.length > 0 && (
        <section className="mt-6">
          <div className="px-5 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h2
              className="text-[20px] font-semibold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Live Now
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 px-5 pb-4">
              {liveDebates.map((debate) => {
                const meta = getCategoryMeta(debate.category || "Other");
                return (
                  <Link
                    key={debate.id}
                    to={`/debate/${debate.id}`}
                  className="premium-panel flex-shrink-0 w-[300px] p-5 hover:-translate-y-0.5"
                  >
                    <span className="inline-flex items-center gap-1 bg-secondary/60 text-foreground/60 px-2 py-1 rounded-[6px] text-[11px] font-medium mb-2">
                      {meta.emoji} {meta.label}
                    </span>
                    <h3
                      className="text-[16px] font-semibold mb-1 line-clamp-2"
                      style={{ fontFamily: "var(--font-family-display)" }}
                    >
                      {debate.title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground mb-3">
                      {debate.user1} vs {debate.user2}
                    </p>
                    <div className="flex items-center justify-between text-[13px] text-muted-foreground">
                      <span className="text-red-500 font-medium">● Live</span>
                      <div className="flex items-center gap-3">
                        <span>👁 {debate.viewers}</span>
                        <span>🗳 {debate.votes}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Popular */}
      {popularDebates.length > 0 && (
        <section className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <h2
              className="text-[20px] font-semibold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Popular Debates
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularDebates.map((debate) => {
              const meta = getCategoryMeta(debate.category || "Other");
              const total = (debate.user1Votes ?? 0) + (debate.user2Votes ?? 0);
              const pct1 = total > 0 ? Math.round(((debate.user1Votes ?? 0) / total) * 100) : 50;
              return (
                <Link
                  key={debate.id}
                  to={`/debate/${debate.id}`}
                  className="premium-panel p-5 hover:-translate-y-0.5 hover:border-primary/30"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[13px]">{meta.emoji}</span>
                    <span className="text-[12px] text-muted-foreground font-medium">{meta.label}</span>
                    {debate.winner && (
                      <span className="ml-auto text-[11px] font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                        Ended
                      </span>
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2 line-clamp-2">{debate.title}</h3>
                  <p className="text-[13px] text-muted-foreground mb-3">
                    {debate.user1} vs {debate.user2}
                  </p>
                  {/* Vote bar */}
                  <div className="flex rounded-full overflow-hidden h-1.5 bg-secondary">
                    <div
                      className="bg-primary transition-all duration-500"
                      style={{ width: `${pct1}%` }}
                    />
                    <div className="bg-orange-400 flex-1" />
                  </div>
                  <div className="flex justify-between mt-1 text-[11px] text-muted-foreground">
                    <span>{pct1}%</span>
                    <span>🗳 {debate.votes}</span>
                    <span>{100 - pct1}%</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty state */}
      {openDebates.length === 0 && liveDebates.length === 0 && popularDebates.length === 0 && (
        <div className="premium-panel mt-5 flex min-h-[310px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] border border-primary/15 bg-primary/5 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h2 className="text-[17px] font-bold tracking-[-0.02em]">{query ? "No search results" : "Start the first debate"}</h2>
          <p className="mt-2 max-w-sm text-[13px] leading-6 text-muted-foreground">
            {query ? "Try a different keyword or category." : "There are no public debates yet. Your question could spark a new perspective."}
          </p>
          <Link to="/create" className="mt-5 inline-flex items-center gap-2 rounded-[12px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Create a Debate
          </Link>
        </div>
      )}

      {/* My Debates */}
      {userDebates.length > 0 && (
        <section className="mt-8">
          <h2
            className="text-[20px] font-semibold mb-4"
            style={{ fontFamily: "var(--font-family-display)" }}
          >
            My Debates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userDebates.map((debate) => (
              <Link
                key={debate.id}
                to={`/debate/${debate.id}`}
                className="premium-panel p-5 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-[15px] font-semibold flex-1">{debate.title}</h3>
                  {debate.isLive && (
                    <span className="ml-2 text-[11px] text-red-500 font-medium whitespace-nowrap">
                      ● Live
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mb-2">
                  {debate.user1} vs {debate.user2}
                </p>
                <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                  {debate.isLive && <span>👁 {debate.viewers}</span>}
                  <span>🗳 {debate.votes}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      </main>
      <aside className="space-y-4">
        <div className="premium-panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[13px] font-bold"><Flame className="h-4 w-4 text-amber-500" /> Popular Categories</h2>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {CATEGORIES.slice(0, 6).map((category, index) => {
              const count = allDebates.filter((debate) => debate.category === category.id).length;
              return (
                <button key={category.id} onClick={() => setActiveCategory(category.id)} className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left hover:bg-secondary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-secondary text-sm">{category.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold">{category.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{count} debates</span>
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">#{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="premium-panel grid grid-cols-3 divide-x divide-border p-4 text-center">
          <div><Radio className="mx-auto mb-1.5 h-4 w-4 text-red-500" /><b className="block text-[13px]">{allDebates.filter((d) => d.isLive).length}</b><span className="text-[9px] text-muted-foreground">LIVE</span></div>
          <div><MessageSquare className="mx-auto mb-1.5 h-4 w-4 text-primary" /><b className="block text-[13px]">{allDebates.length}</b><span className="text-[9px] text-muted-foreground">DEBATES</span></div>
          <div><Vote className="mx-auto mb-1.5 h-4 w-4 text-emerald-500" /><b className="block text-[13px]">{allDebates.reduce((sum, debate) => sum + debate.votes, 0)}</b><span className="text-[9px] text-muted-foreground">VOTES</span></div>
        </div>
      </aside>
      </div>
    </div>
  );
}
