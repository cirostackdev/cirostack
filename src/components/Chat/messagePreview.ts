/**
 * Returns a human-readable one-line preview of any message body/fileUrl combo.
 * Used for reply previews so raw JSON / filenames are never shown.
 */
export function messagePreview(body: string, fileUrl?: string | null): string {
  // File / media messages — body is the filename
  if (fileUrl) {
    const lower = (fileUrl + body).toLowerCase();
    if (body.startsWith("voice-note-") || lower.includes("audio/") || /\.(mp3|mp4a|wav|aac|m4a|webm|ogg)/.test(lower)) {
      return "🎤 Voice note";
    }
    if (lower.includes("video/") || /\.(mp4|mov|webm|ogg)/.test(lower)) {
      return "🎬 Video";
    }
    if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) {
      return "🖼️ Image";
    }
    // Generic file — show just the base filename without long IDs
    const parts = body.split("-");
    // Strip leading numeric ID prefix (e.g. "1781123012434-CiroStack.docx" → "CiroStack.docx")
    const cleaned = parts.length > 1 && /^\d{10,}$/.test(parts[0]) ? parts.slice(1).join("-") : body;
    return `📄 ${cleaned}`;
  }

  // Structured messages
  if (body.startsWith("__CATALOG__") || (body.startsWith("📂") && body.includes("Catalog"))) {
    return "📂 Portfolio Catalog";
  }
  if (body.startsWith("__CONTACT__") || (body.startsWith("📇") && body.includes("Contact"))) {
    return "📇 Contact Info";
  }
  if (body.startsWith("__EVENT__") || (body.startsWith("🗓") && body.includes("Events"))) {
    return "📅 Events";
  }

  // Plain text — return as-is (truncation handled by CSS)
  return body;
}
