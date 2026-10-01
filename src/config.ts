/**
 * Centrale configuratie voor MyTube.
 * 
 * Een Google OAuth Client ID is een PUBLIEKE identifier (géén geheim wachtwoord).
 * Je kunt hier je eigen Client ID hardcoden zodat de "Inloggen met Google" knop
 * DIRECT het officiële Google inlogvenster opent zonder dat je ooit iets hoeft in te vullen!
 * 
 * Zorg dat in de Google Cloud Console bij "Authorized JavaScript origins" staat:
 * - http://localhost:5173
 * - https://<jouw-gebruikersnaam>.github.io
 */
export const HARDCODED_GOOGLE_CLIENT_ID = '';

export const DEFAULT_CONFIG = {
  appName: 'MyTube',
  defaultTimeBudgetMinutes: 15,
};
