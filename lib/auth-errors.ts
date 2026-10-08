// Turns Supabase auth errors into short, friendly messages. Raw error text is never shown.
type AuthErrorLike = { code?: string; status?: number; name?: string; message?: string } | null | undefined;

const MESSAGES: Record<string, string> = {
  invalid_credentials: "That email and password don't match. Check them and try again.",
  email_not_confirmed: "Confirm your email first. Check your inbox for the link we sent.",
  user_already_exists: "There's already an account with that email. Sign in instead.",
  email_exists: "There's already an account with that email. Sign in instead.",
  weak_password: "Choose a stronger password: at least 8 characters.",
  same_password: "Choose a password you haven't used here before.",
  email_address_invalid: "Enter a valid email address.",
  validation_failed: "Check your email and password and try again.",
  over_request_rate_limit: "Too many attempts. Wait a minute and try again.",
  over_email_send_rate_limit: "We've sent too many emails. Wait a little while and try again.",
  otp_expired: "That link has expired or was already used. Request a new one.",
  flow_state_expired: "That link has expired. Request a new one.",
  bad_code_verifier: "Open the link in the same browser you used to request it, or request a new one.",
  session_not_found: "Your session has ended. Open the link from your email again.",
  signup_disabled: "New sign-ups are closed right now.",
};

export function authMessage(error: AuthErrorLike): string {
  if (error?.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error?.status === 429) return MESSAGES.over_request_rate_limit;
  // supabase-js also raises AuthRetryableFetchError for 5xx replies; only status 0 is a real network failure.
  if (error?.name === "AuthRetryableFetchError" && !error.status) return NETWORK_ERROR;
  return "Something went wrong. Please try again.";
}

// Sign-up sends the confirmation email inside the request, so a server error there almost
// always means the email couldn't be sent.
export function signupMessage(error: AuthErrorLike): string {
  if (error?.status && error.status >= 500) return EMAIL_SEND_ERROR;
  if (error?.message && /sending.*email|email.*send/i.test(error.message) && error.code !== "over_email_send_rate_limit") return EMAIL_SEND_ERROR;
  return authMessage(error);
}

const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again.";
const EMAIL_SEND_ERROR = "We couldn't send the confirmation email. Please try again in a few minutes.";
export const MISMATCH = "Passwords don't match";

export const LINK_ERROR = "That link has expired or was already used. Request a new one.";
