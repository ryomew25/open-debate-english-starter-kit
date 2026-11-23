import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useDebates } from "../contexts/DebateContext";

interface ReportDialogProps {
  debateId: string;
  messageId?: string;
  commentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDialog({ debateId, messageId, commentId, isOpen, onClose }: ReportDialogProps) {
  const { addReport } = useDebates();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = [
    "Spam or advertising",
    "Harassment or abusive language",
    "Inappropriate content",
    "Disruptive behavior",
    "Other",
  ];

  const handleSubmit = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reason.trim()) return;

    addReport(debateId, messageId, commentId, reason);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
        <div 
          className="bg-card rounded-[20px] w-full max-w-md overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 
                className="text-[20px] font-semibold"
                style={{ fontFamily: "var(--font-family-display)" }}
              >
                Submit report
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-[14px] text-muted-foreground mb-6">
              Select a reason for your report. A moderator will review it and take appropriate action.
            </p>

            <div className="space-y-3 mb-6">
              {reasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full text-left px-4 py-3 rounded-[12px] transition-all duration-300 ${
                    selectedReason === reason
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 hover:bg-secondary"
                  }`}
                >
                  <span className="text-[14px] font-medium">{reason}</span>
                </button>
              ))}
            </div>

            {selectedReason === "Other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Add more details (optional)"
                className="w-full bg-secondary/50 border border-border rounded-[12px] px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 mb-6"
                rows={3}
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-secondary rounded-[12px] font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || (selectedReason === "Other" && !customReason.trim())}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-[12px] font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}