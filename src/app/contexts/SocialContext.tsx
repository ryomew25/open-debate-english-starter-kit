import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Follow {
  follower: string; // Who is following
  following: string; // Who is being followed
  createdAt: number;
}

export interface Notification {
  id: string;
  type: "follow" | "comment" | "reply" | "reaction" | "vote" | "debate_invitation";
  from: string; // Who triggered the notification
  to: string; // Who receives the notification
  debateId?: string;
  messageId?: string;
  commentId?: string;
  content?: string;
  createdAt: number;
  read: boolean;
  invitationData?: {
    topic: string;
    side: "user1" | "user2";
  };
}

export interface DebateInvitation {
  id: string;
  from: string; // Who sent the invitation
  to: string; // Who receives the invitation
  topic: string; // Debate topic
  side: "user1" | "user2"; // Which side the invitee will take
  status: "pending" | "accepted" | "declined";
  createdAt: number;
  debateId?: string; // Set when accepted
}

interface SocialContextType {
  follows: Follow[];
  followUser: (username: string) => void;
  unfollowUser: (username: string) => void;
  isFollowing: (username: string) => boolean;
  getFollowers: (username: string) => Follow[];
  getFollowing: (username: string) => Follow[];
  notifications: Notification[];
  addNotification: (to: string, content: string) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
  getUserNotifications: (username: string) => Notification[];
  invitations: DebateInvitation[];
  sendInvitation: (to: string, topic: string, side: "user1" | "user2") => void;
  acceptInvitation: (invitationId: string, debateId: string) => void;
  declineInvitation: (invitationId: string) => void;
  getUserInvitations: (username: string) => DebateInvitation[];
  getPendingInvitations: (username: string) => DebateInvitation[];
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const user = auth?.user;
  const [follows, setFollows] = useState<Follow[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invitations, setInvitations] = useState<DebateInvitation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentUser = user?.name || "Guest User";

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFollows = localStorage.getItem("follows");
      if (storedFollows) {
        setFollows(JSON.parse(storedFollows));
      }

      const storedNotifications = localStorage.getItem("notifications");
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }

      const storedInvitations = localStorage.getItem("invitations");
      if (storedInvitations) {
        setInvitations(JSON.parse(storedInvitations));
      }
    } catch (e) {
      console.error("Failed to load social data", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("follows", JSON.stringify(follows));
    }
  }, [follows, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("invitations", JSON.stringify(invitations));
    }
  }, [invitations, isInitialized]);

  const followUser = (username: string) => {
    if (username === currentUser) return; // Can't follow yourself
    
    const existing = follows.find(
      (f) => f.follower === currentUser && f.following === username
    );
    
    if (!existing) {
      const newFollow: Follow = {
        follower: currentUser,
        following: username,
        createdAt: Date.now(),
      };
      setFollows((prev) => [...prev, newFollow]);

      // Create notification for the followed user
      addNotification(username, `${currentUser} followed you`);
    }
  };

  const unfollowUser = (username: string) => {
    setFollows((prev) =>
      prev.filter(
        (f) => !(f.follower === currentUser && f.following === username)
      )
    );
  };

  const isFollowing = (username: string): boolean => {
    return follows.some(
      (f) => f.follower === currentUser && f.following === username
    );
  };

  const getFollowers = (username: string): Follow[] => {
    return follows.filter((f) => f.following === username);
  };

  const getFollowing = (username: string): Follow[] => {
    return follows.filter((f) => f.follower === username);
  };

  const addNotification = (
    to: string,
    content: string
  ) => {
    const newNotification: Notification = {
      type: "follow",
      from: currentUser,
      to: to,
      content: content,
      id: `notif-${Date.now()}`,
      createdAt: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.to === currentUser ? { ...n, read: true } : n))
    );
  };

  const getUnreadCount = (): number => {
    return notifications.filter((n) => n.to === currentUser && !n.read).length;
  };

  const getUserNotifications = (username: string): Notification[] => {
    return notifications
      .filter((n) => n.to === username)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const sendInvitation = (to: string, topic: string, side: "user1" | "user2") => {
    if (to === currentUser) return; // Can't invite yourself

    const newInvitation: DebateInvitation = {
      id: `invitation-${Date.now()}`,
      from: currentUser,
      to,
      topic,
      side,
      status: "pending",
      createdAt: Date.now(),
    };

    setInvitations((prev) => [...prev, newInvitation]);

    // Create notification for the invited user
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: "debate_invitation",
      from: currentUser,
      to,
      content: `${currentUser} invited you to debate: "${topic}"`,
      createdAt: Date.now(),
      read: false,
      invitationData: {
        topic,
        side,
      },
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const acceptInvitation = (invitationId: string, debateId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "accepted", debateId } : inv
      )
    );
  };

  const declineInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "declined" } : inv
      )
    );
  };

  const getUserInvitations = (username: string): DebateInvitation[] => {
    return invitations
      .filter((inv) => inv.to === username || inv.from === username)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  const getPendingInvitations = (username: string): DebateInvitation[] => {
    return invitations
      .filter((inv) => inv.to === username && inv.status === "pending")
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  return (
    <SocialContext.Provider
      value={{
        follows,
        followUser,
        unfollowUser,
        isFollowing,
        getFollowers,
        getFollowing,
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getUnreadCount,
        getUserNotifications,
        invitations,
        sendInvitation,
        acceptInvitation,
        declineInvitation,
        getUserInvitations,
        getPendingInvitations,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
}