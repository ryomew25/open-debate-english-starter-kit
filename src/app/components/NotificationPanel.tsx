import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bell, Heart, MessageCircle, UserPlus, ThumbsUp, X, Swords, Check, XCircle } from "lucide-react";
import { useSocial } from "../contexts/SocialContext";
import { useAuth } from "../contexts/AuthContext";
import { useDebates } from "../contexts/DebateContext";
import { Button } from "./ui/button";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { getUserNotifications, markAsRead, markAllAsRead, getPendingInvitations, acceptInvitation, declineInvitation } = useSocial();
  const { user } = useAuth();
  const { addDebate } = useDebates();
  const navigate = useNavigate();
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);

  if (!user) return null;

  const notifications = getUserNotifications(user.name);
  const pendingInvitations = getPendingInvitations(user.name);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "reply":
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case "reaction":
        return <ThumbsUp className="w-4 h-4 text-yellow-500" />;
      case "vote":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "debate_invitation":
        return <Swords className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationText = (notification: typeof notifications[0]) => {
    switch (notification.type) {
      case "follow":
        return `${notification.from} followed you`;
      case "comment":
        return `${notification.from} commented on a debate`;
      case "reply":
        return `${notification.from} replied to you`;
      case "reaction":
        return `${notification.from} reacted to your post`;
      case "vote":
        return `${notification.from} voted`;
      case "debate_invitation":
        return notification.content || `${notification.from} invited you to a debate`;
      default:
        return "New notification";
    }
  };

  const handleAcceptInvitation = async (invitationId: string, topic: string, from: string, side: "user1" | "user2") => {
    setProcessingInvitation(invitationId);

    const debateId = addDebate({
      title: topic,
      user1: side === "user1" ? user.name : from,
      user2: side === "user2" ? user.name : from,
      isLive: true,
      viewers: 0,
      votes: 0,
      category: "General",
      duration: 30,
      startedAt: Date.now(),
    });

    acceptInvitation(invitationId, debateId);
    setProcessingInvitation(null);

    onClose();
    navigate(`/debate/${debateId}`);
  };

  const handleDeclineInvitation = (invitationId: string) => {
    setProcessingInvitation(invitationId);
    declineInvitation(invitationId);
    setProcessingInvitation(null);
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 
              className="text-[20px] font-semibold"
              style={{ fontFamily: "var(--font-family-display)" }}
            >
              Notifications
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 text-[13px] text-primary hover:bg-secondary/50 rounded-[8px] transition-colors"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 && pendingInvitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-[16px] text-muted-foreground">
                You have no notifications yet.
              </p>
            </div>
          ) : (
            <div>
              {/* Pending Invitations */}
              {pendingInvitations.length > 0 && (
                <div className="border-b-4 border-primary/20">
                  <div className="bg-primary/5 px-4 py-2">
                    <p className="text-[13px] font-semibold text-primary">Debate invitations</p>
                  </div>
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="p-4 border-b border-border bg-orange-500/5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Swords className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium mb-1">
                            {invitation.from} invited you to a debate
                          </p>
                          <p className="text-[13px] text-muted-foreground mb-1">
                            Topic: {invitation.topic}
                          </p>
                          <p className="text-[12px] text-muted-foreground mb-3">
                            Your position: {invitation.side === "user1" ? "For" : "Against"}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptInvitation(invitation.id, invitation.topic, invitation.from, invitation.side)}
                              disabled={processingInvitation === invitation.id}
                              className="h-8 rounded-[8px] text-[13px] bg-primary hover:bg-primary/90"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeclineInvitation(invitation.id)}
                              disabled={processingInvitation === invitation.id}
                              className="h-8 rounded-[8px] text-[13px]"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular Notifications */}
              {notifications.map((notification) => {
                const invitation = notification.type === "debate_invitation"
                  ? pendingInvitations.find(inv => inv.from === notification.from)
                  : null;

                if (notification.type === "debate_invitation" && invitation && invitation.status === "pending") {
                  return null;
                }

                return (
                  <Link
                    key={notification.id}
                    to={notification.debateId ? `/debate/${notification.debateId}` : "/"}
                    onClick={() => {
                      markAsRead(notification.id);
                      onClose();
                    }}
                    className={`block p-4 border-b border-border hover:bg-secondary/30 transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] mb-1">
                          {getNotificationText(notification)}
                        </p>
                        {notification.content && notification.type !== "debate_invitation" && (
                          <p className="text-[13px] text-muted-foreground truncate">
                            {notification.content}
                          </p>
                        )}
                        <p className="text-[12px] text-muted-foreground mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
