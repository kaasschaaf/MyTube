/**
 * Central configuration for MyTube.
 *
 * A Google OAuth client ID is a public identifier, not a password. You can set
 * your own client ID here to open Google's sign-in flow without entering it in
 * the app. Add your local and deployed origins in Google Cloud Console under
 * "Authorized JavaScript origins".
 */
export const HARDCODED_GOOGLE_CLIENT_ID = '';

export const DEFAULT_CONFIG = {
  appName: 'MyTube',
  defaultTimeBudgetMinutes: 15,
};
