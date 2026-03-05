/**
 * Resolves the auth token used for cookie verification.
 * If AUTH_TOKEN env var is set, uses that.
 * Otherwise, derives a token from APP_PASSWORD so users don't need to set both.
 */
export function getAuthToken(): string | null {
  if (process.env.AUTH_TOKEN) return process.env.AUTH_TOKEN
  if (process.env.APP_PASSWORD) {
    let hash = 0
    const s = 'wedding_salt_' + process.env.APP_PASSWORD
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
    }
    return 'auto_' + Math.abs(hash).toString(36)
  }
  return null
}
