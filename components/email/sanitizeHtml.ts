import DOMPurify from 'dompurify';

// Utility to sanitize HTML for safe rendering
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}
