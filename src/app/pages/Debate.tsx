import { useParams, Link } from "react-router";
import { ArrowLeft, Share2, Heart, MessageCircle, Send, Trash2, ThumbsUp, ThumbsDown, Flag, UserPlus, UserMinus, Image, Reply } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDebates } from "../contexts/DebateContext";
import { useSocial } from "../contexts/SocialContext";
import { DebateTimer } from "../components/DebateTimer";
import { DebateResult } from "../components/DebateResult";
import { ReportDialog } from "../components/ReportDialog";

export function Debate() {
  const { id } = useParams();
  const { 
    getDebate, 
    vote, 
    getUserVote, 
    getMessages,
    addMessage,
    deleteMessage,
    getComments, 
    addComment, 
    deleteComment,
    getReactionCounts,
    getUserReaction,
    toggleReaction,
    endDebate,
    currentUser
  } = useDebates();
  const { isFollowing, followUser, unfollowUser, addNotification } = useSocial();
  const [debate, setDebate] = useState(getDebate(id || ""));
  const [debateMessages, setDebateMessages] = useState(getMessages(id || ""));
  const [liked, setLiked] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<{ messageId: string; commentId?: string; author: string } | null>(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messageImage, setMessageImage] = useState<string | null>(null);
  const [selectedSide, setSelectedSide] = useState<"user1" | "user2" | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ messageId?: string; commentId?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const foundDebate = getDebate(id);
      setDebate(foundDebate);
      
      if (foundDebate) {
        const msgs = getMessages(id);
        setDebateMessages(msgs);
      }
    }
  }, [id, getDebate, getMessages]);

  if (!debate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[24px] font-semibold mb-4">Debate not found</h2>
          <Link to="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const userVote = getUserVote(debate.id);
  const user1Votes = debate.user1Votes || 0;
  const user2Votes = debate.user2Votes || 0;
  const totalVotes = user1Votes + user2Votes;
  const user1Percentage = totalVotes > 0 ? Math.round((user1Votes / totalVotes) * 100) : 50;
  const user2Percentage = totalVotes > 0 ? Math.round((user2Votes / totalVotes) * 100) : 50;

  const handleVote = (side: "user1" | "user2") => {
    vote(debate.id, side);
    const updatedDebate = getDebate(debate.id);
    if (updatedDebate) {
      setDebate(updatedDebate);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: debate.title,
        text: `${debate.user1} vs ${debate.user2}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleAddComment = (messageId: string) => {
    const text = commentTexts[messageId];
    if (text?.trim()) {
      addComment(debate.id, messageId, text);
      setCommentTexts({ ...commentTexts, [messageId]: "" });
    }
  };

  const handleReaction = (messageId: string, type: "like" | "dislike") => {
    toggleReaction(debate.id, messageId, type);
  };

  const handleSendMessage = () => {
    if (newMessageText.trim() && selectedSide) {
      const author = selectedSide === "user1" ? debate.user1 : debate.user2;
      addMessage(debate.id, newMessageText, selectedSide, author, messageImage);
      setNewMessageText("");
      setMessageImage(null);
      // Refresh messages
      const msgs = getMessages(debate.id);
      setDebateMessages(msgs);
    }
  };

  const handleTimeUp = () => {
    if (!debate.endedAt) {
      endDebate(debate.id);
      const updatedDebate = getDebate(debate.id);
      if (updatedDebate) {
        setDebate(updatedDebate);
      }
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const handleFollow = (user: string) => {
    if (currentUser && user !== currentUser) {
      if (isFollowing(user)) {
        unfollowUser(user);
      } else {
        followUser(user);
        addNotification(user, `${currentUser} followed you`);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMessageImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pb-80">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="h-[88px] flex items-center justify-between px-5">
          <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            {/* Timer */}
            {debate.startedAt && debate.duration && !debate.endedAt && (
              <DebateTimer 
                startedAt={debate.startedAt} 
                duration={debate.duration}
                onTimeUp={handleTimeUp}
              />
            )}
            <button 
              onClick={() => setLiked(!liked)}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Topic */}
        <div className="px-5 pb-6 text-center">
          <h1 className="text-[24px] font-semibold mb-2" style={{ fontFamily: "var(--font-family-display)" }}>
            {debate.title}
          </h1>
          <p className="text-[14px] text-muted-foreground">
            {debate.user1} vs {debate.user2}
          </p>
          {debate.isLive && !debate.endedAt && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[13px] text-red-500 font-medium">Live</span>
              <span className="text-[13px] text-muted-foreground ml-2">👁 {debate.viewers}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto px-5 pt-8 pb-8">
        {/* Result Display */}
        {debate.endedAt && <DebateResult debate={debate} />}

        {debateMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-[16px] mb-2">No messages yet</p>
            <p className="text-[14px]">Be the first to post a message!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {debateMessages.map((msg) => {
              const comments = getComments(debate.id, msg.id);
              const { likes, dislikes } = getReactionCounts(debate.id, msg.id);
              const userReaction = getUserReaction(debate.id, msg.id);
              const isExpanded = expandedComments === msg.id;

              return (
                <div key={msg.id}>
                  <div className={`flex ${msg.side === "user1" ? "justify-start" : "justify-end"}`}>
                    <div className={`relative max-w-[85%]`}>
                      {/* Side indicator line */}
                      <div
                        className={`absolute top-0 bottom-0 w-[2px] ${
                          msg.side === "user1" ? "bg-primary left-0" : "bg-muted-foreground right-0"
                        }`}
                        style={{
                          left: msg.side === "user1" ? "-12px" : "auto",
                          right: msg.side === "user2" ? "-12px" : "auto",
                        }}
                      />
                      
                      <div className="bg-card rounded-[16px] p-6" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
                        <div className={`text-[14px] font-medium mb-3 ${
                          msg.side === "user1" ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {msg.author}
                        </div>
                        <p className="text-[16px] leading-relaxed mb-4" style={{ lineHeight: "1.7" }}>
                          {msg.content}
                        </p>
                        {msg.imageUrl && (
                          <div className="mb-4">
                            <img
                              src={msg.imageUrl}
                              alt="Message attachment"
                              className="w-full h-auto rounded-[12px]"
                            />
                          </div>
                        )}
                        <div className="text-[12px] text-muted-foreground mb-4">
                          {formatTime(msg.createdAt)}
                        </div>

                        {/* Action buttons - YouTube style */}
                        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                          <button
                            onClick={() => handleReaction(msg.id, "like")}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-[8px] transition-all duration-300 ${
                              userReaction === "like"
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <ThumbsUp className={`w-4 h-4 ${userReaction === "like" ? "fill-current" : ""}`} />
                            <span className="text-[13px] font-medium">{likes > 0 ? likes : ""}</span>
                          </button>
                          <button
                            onClick={() => handleReaction(msg.id, "dislike")}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-[8px] transition-all duration-300 ${
                              userReaction === "dislike"
                                ? "bg-red-500/10 text-red-500"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <ThumbsDown className={`w-4 h-4 ${userReaction === "dislike" ? "fill-current" : ""}`} />
                            <span className="text-[13px] font-medium">{dislikes > 0 ? dislikes : ""}</span>
                          </button>
                          <button
                            onClick={() => setExpandedComments(isExpanded ? null : msg.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] hover:bg-secondary/50 transition-all duration-300 ml-auto"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-[13px] font-medium">
                              {comments.length > 0 ? comments.length : "Comments"}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setReportDialogOpen(true);
                              setReportTarget({ messageId: msg.id });
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] hover:bg-secondary/50 transition-all duration-300"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {isExpanded && (
                    <div className={`mt-4 ${msg.side === "user1" ? "ml-8" : "mr-8"}`}>
                      <div className="bg-secondary/20 rounded-[16px] p-5">
                        {/* Comment Input */}
                        <div className="mb-4">
                          <textarea
                            value={commentTexts[msg.id] || ""}
                            onChange={(e) => setCommentTexts({ ...commentTexts, [msg.id]: e.target.value })}
                            placeholder="Add a comment..."
                            className="w-full bg-card rounded-[12px] p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            rows={2}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => handleAddComment(msg.id)}
                              disabled={!commentTexts[msg.id]?.trim()}
                              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-[10px] text-[14px] font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Send
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-3">
                          {comments.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground text-[14px]">
                              Be the first to leave a comment!
                            </div>
                          ) : (
                            comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="bg-card rounded-[12px] p-4"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-[12px]">
                                      👤
                                    </div>
                                    <div>
                                      <div className="font-medium text-[13px]">{comment.author}</div>
                                      <div className="text-[11px] text-muted-foreground">
                                        {formatTime(comment.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => deleteComment(comment.id)}
                                    className="p-1.5 hover:bg-secondary/50 rounded-full transition-colors duration-300"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                </div>
                                <p className="text-[14px] leading-relaxed">{comment.content}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-4">
          {/* Side Selector */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => setSelectedSide("user1")}
              className={`py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-300 ${
                selectedSide === "user1"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              Post as {debate.user1}
            </button>
            <button
              onClick={() => setSelectedSide("user2")}
              className={`py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-300 ${
                selectedSide === "user2"
                  ? "bg-muted text-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              Post as {debate.user2}
            </button>
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder={selectedSide ? "Write a message..." : "Choose a side to participate"}
              disabled={!selectedSide}
              className="flex-1 bg-secondary/30 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessageText.trim() || !selectedSide}
              className="px-6 bg-primary text-primary-foreground rounded-[12px] font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 bg-primary text-primary-foreground rounded-[12px] font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Vote Section */}
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={() => handleVote("user1")}
                className={`py-3 rounded-[12px] font-medium text-[14px] transition-all duration-300 ${
                  userVote === "user1"
                    ? "bg-primary text-primary-foreground scale-105"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Vote for {debate.user1}
              </button>
              <button
                onClick={() => handleVote("user2")}
                className={`py-3 rounded-[12px] font-medium text-[14px] transition-all duration-300 ${
                  userVote === "user2"
                    ? "bg-muted text-foreground scale-105"
                    : "bg-secondary/50 hover:bg-secondary"
                }`}
              >
                Vote for {debate.user2}
              </button>
            </div>
            
            {/* Vote percentages */}
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="text-primary font-medium">{user1Percentage}%</span>
              <span className="text-muted-foreground">{totalVotes} votes</span>
              <span className="text-muted-foreground font-medium">{user2Percentage}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${user1Percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        debateId={debate.id}
        messageId={reportTarget.messageId}
        commentId={reportTarget.commentId}
      />
    </div>
  );
}