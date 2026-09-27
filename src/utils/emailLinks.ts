/**
 * Email and Gmail URL Utilities
 * Ensures recipient 'saiprakashkulkarni494@gmail.com' is always explicitly populated
 * in the 'To:' field without URL encoding artifacts that cause Gmail web compose
 * to drop or ignore the recipient.
 */

export const OWNER_EMAIL = 'saiprakashkulkarni494@gmail.com';

export interface EmailLinkOptions {
  to?: string;
  subject?: string;
  body?: string;
}

/**
 * Builds a Gmail web compose link.
 * 
 * CRITICAL FIX FOR GMAIL:
 * Gmail's web compose handler (`mail.google.com/mail/?view=cm&fs=1...`) validates the `to`
 * query parameter. If the email has `@` encoded as `%40`, Gmail's frontend regex rejects it
 * and opens the composer with an EMPTY 'To:' recipient field!
 * Keeping literal '@' ensures Gmail automatically populates 'saiprakashkulkarni494@gmail.com'
 * in the 'To:' recipient chip by default.
 */
export function getGmailComposeUrl(options?: EmailLinkOptions): string {
  const recipient = (options?.to || OWNER_EMAIL).trim();
  const params: string[] = [
    'view=cm',
    'fs=1',
    `to=${recipient}`
  ];

  if (options?.subject) {
    params.push(`su=${encodeURIComponent(options.subject)}`);
  }
  if (options?.body) {
    params.push(`body=${encodeURIComponent(options.body)}`);
  }

  return `https://mail.google.com/mail/?${params.join('&')}`;
}

/**
 * Builds a standard RFC mailto: link for native mail clients (including mobile Gmail app).
 */
export function getMailtoUrl(options?: EmailLinkOptions): string {
  const recipient = (options?.to || OWNER_EMAIL).trim();
  const queryParts: string[] = [];

  if (options?.subject) {
    queryParts.push(`subject=${encodeURIComponent(options.subject)}`);
  }
  if (options?.body) {
    queryParts.push(`body=${encodeURIComponent(options.body)}`);
  }

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return `mailto:${recipient}${query}`;
}
