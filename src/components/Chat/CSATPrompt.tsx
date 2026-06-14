"use client";

import { useState } from "react";
import { Star, Send, X } from "lucide-react";
import { toast } from "sonner";

interface CSATPromptProps {
  conversationId: string;
  onClose: () => void;
}

export function CSATPrompt({ conversationId, onClose }: CSATPromptProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/csat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          rating,
          feedback: feedback.trim() || undefined,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
      } else {
        const data = await res.json();
        if (res.status === 409) {
          toast.info("You've already rated this conversation");
          onClose();
        } else {
          toast.error(data.error || "Failed to submit rating");
        }
      }
    } catch {
      toast.error("Failed to submit rating");
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="p-4 text-center space-y-2 animate-in fade-in duration-300">
        <div className="text-2xl">Thank you!</div>
        <p className="text-sm text-muted-foreground">Your feedback helps us improve.</p>
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className="p-4 space-y-4 border-t border-border bg-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">How was your experience?</p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Star rating */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
        {(hoveredStar || rating) > 0 && (
          <span className="text-xs text-muted-foreground">
            {ratingLabels[hoveredStar || rating]}
          </span>
        )}
      </div>

      {/* Feedback textarea */}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Any additional feedback? (optional)"
        rows={2}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          No thanks
        </button>
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? "Sending..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
