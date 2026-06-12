/**
 * Returns a clean human-readable label for media/structured messages.
 * Stored as replyToBody in the DB — no emojis, used by ReplyPreview for display.
 * Plain text messages are stored as-is.
 */
export function messagePreview(body: string, fileUrl?: string | null): string {
  if (fileUrl) {
    const lower = (fileUrl + body).toLowerCase();
    if (body.startsWith("voice-note-") || lower.includes("audio/") || /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)/.test(lower)) {
      return "Voice message";
    }
    if (lower.includes("video/") || /\.(mp4|mov|webm|ogg)/.test(lower)) {
      return "Video";
    }
    if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) {
      return "Photo";
    }
    // Generic file — strip leading numeric upload ID
    const parts = body.split("-");
    const cleaned = parts.length > 1 && /^\d{10,}$/.test(parts[0]) ? parts.slice(1).join("-") : body;
    return cleaned;
  }

  if (body.startsWith("__CATALOG__") || (body.startsWith("📂") && body.includes("Catalog"))) return "Portfolio Catalog";
  if (body.startsWith("__CONTACT__") || (body.startsWith("📇") && body.includes("Contact"))) return "Contact Info";
  if (body.startsWith("__EVENT__") || (body.startsWith("🗓") && body.includes("Events"))) return "Events";

  // Strip legacy emoji prefixes from already-stored bodies
  return body.replace(/^[📂📇📅🎤🎬🖼️📄]\s*/, "");
}
