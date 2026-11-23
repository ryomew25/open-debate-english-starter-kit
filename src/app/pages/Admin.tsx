import { Link } from "react-router";
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export function Admin() {
  const { getReports, updateReportStatus, getDebate, getMessages, comments } = useDebates();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "reviewed" | "dismissed">("all");

  const reports = getReports();
  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(r => r.status === filter);

  // Simple admin check - in production, use proper role-based access control
  const isAdmin = user?.name === "Admin";

  if (!user) {
    return (
      <div className="min-h-screen pb-12">
        <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border h-[88px] flex items-center px-5">
          <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-4 text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            Admin Dashboard
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <div className="bg-card rounded-[16px] p-12" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)" }}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-[24px] font-semibold mb-3" style={{ fontFamily: "var(--font-family-display)" }}>
              Access restricted
            </h2>
            <p className="text-[16px] text-muted-foreground mb-8">
              You need administrator permissions to access this page.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-[12px] text-[16px] font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen pb-12">
        <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border h-[88px] flex items-center px-5">
          <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-4 text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            Admin Dashboard
          </h1>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-24 text-center">
          <div className="bg-card rounded-[16px] p-12" style={{ boxShadow: "0 2px 16px rgba(0, 0, 0, 0.08)" }}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-[24px] font-semibold mb-3" style={{ fontFamily: "var(--font-family-display)" }}>
              You do not have administrator permissions.
            </h2>
            <p className="text-[16px] text-muted-foreground mb-8">
              This page is available to administrators only.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-[12px] text-[16px] font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border h-[88px] flex items-center px-5">
        <Link to="/" className="p-2 hover:bg-secondary/50 rounded-full transition-colors duration-300">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 ml-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-family-display)" }}>
            Admin Dashboard
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-[16px] p-6 text-center" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
            <div className="text-[32px] font-bold text-red-500 mb-1">
              {reports.filter(r => r.status === "pending").length}
            </div>
            <div className="text-[13px] text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card rounded-[16px] p-6 text-center" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
            <div className="text-[32px] font-bold text-green-500 mb-1">
              {reports.filter(r => r.status === "reviewed").length}
            </div>
            <div className="text-[13px] text-muted-foreground">Reviewed</div>
          </div>
          <div className="bg-card rounded-[16px] p-6 text-center" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
            <div className="text-[32px] font-bold text-gray-500 mb-1">
              {reports.filter(r => r.status === "dismissed").length}
            </div>
            <div className="text-[13px] text-muted-foreground">Dismissed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-secondary/30 p-1 rounded-[12px]">
          {["all", "pending", "reviewed", "dismissed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 py-2 px-4 rounded-[10px] text-[14px] font-medium transition-all duration-300 ${
                filter === f
                  ? "bg-card shadow-sm"
                  : "hover:bg-secondary/50"
              }`}
            >
              {f === "all" && "All"}
              {f === "pending" && "Pending"}
              {f === "reviewed" && "Reviewed"}
              {f === "dismissed" && "Dismissed"}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-card rounded-[16px] p-12 text-center" style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-[16px] text-muted-foreground">
                No reports found.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const debate = getDebate(report.debateId);
              const message = report.messageId 
                ? getMessages(report.debateId).find(m => m.id === report.messageId)
                : undefined;
              const comment = report.commentId
                ? comments.find(c => c.id === report.commentId)
                : undefined;

              return (
                <div
                  key={report.id}
                  className="bg-card rounded-[16px] p-6 border border-border"
                  style={{ boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
                >
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-[6px] text-[12px] font-medium ${
                            report.status === "pending"
                              ? "bg-red-500/10 text-red-500"
                              : report.status === "reviewed"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {report.status === "pending" && "Pending"}
                          {report.status === "reviewed" && "Reviewed"}
                          {report.status === "dismissed" && "Dismissed"}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          {new Date(report.createdAt).toLocaleString("en-US")}
                        </span>
                      </div>
                      <div className="text-[14px] text-muted-foreground">
                        Reported by: {report.reportedBy}
                      </div>
                    </div>
                  </div>

                  {/* Debate Info */}
                  {debate && (
                    <div className="mb-3">
                      <Link
                        to={`/debate/${debate.id}`}
                        className="text-[15px] font-medium text-primary hover:underline"
                      >
                        {debate.title}
                      </Link>
                    </div>
                  )}

                  {/* Reported Content */}
                  {message && (
                    <div className="bg-secondary/30 rounded-[12px] p-4 mb-4">
                      <div className="text-[12px] text-muted-foreground mb-2">
                        Reported message by {message.author}
                      </div>
                      <div className="text-[14px]">{message.content}</div>
                    </div>
                  )}
                  
                  {comment && (
                    <div className="bg-secondary/30 rounded-[12px] p-4 mb-4">
                      <div className="text-[12px] text-muted-foreground mb-2">
                        Reported comment by {comment.author}
                      </div>
                      <div className="text-[14px]">{comment.content}</div>
                    </div>
                  )}

                  {/* Reason */}
                  <div className="mb-4">
                    <div className="text-[12px] text-muted-foreground mb-1">
                      Reason
                    </div>
                    <div className="text-[14px] font-medium">{report.reason}</div>
                  </div>

                  {/* Actions */}
                  {report.status === "pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateReportStatus(report.id, "reviewed")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-[12px] font-medium hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as reviewed
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, "dismissed")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-[12px] font-medium hover:bg-gray-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Dismiss report
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
