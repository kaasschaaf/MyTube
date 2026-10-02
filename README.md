# MyTube - YouTube Subscription Filter

MyTube is a responsive web app and installable PWA for filtering YouTube videos by **duration**, **favorite channels**, and **watched status**. It can run with a built-in demo feed or connect to your YouTube account using Google OAuth in your browser.

The app is a static single-page application with no MyTube backend or user database. See the [Privacy Policy](./public/privacy.html) for details about local browser storage and third-party services.

## Features

- **Filter by duration:** Use preset ranges or set a custom time budget.
- **Manage channels:** Favorite or mute channels without changing your YouTube subscriptions.
- **Filter your feed:** Hide watched videos by default and toggle watched status as needed. You can also hide live streams and videos up to 3 minutes long (a Shorts approximation; regular short videos may be hidden too).
- **Responsive PWA:** Use the desktop layout or mobile navigation; add the app to your home screen.
- **Optional Google sign-in:** Read your YouTube subscriptions and recent uploads through the YouTube Data API. Previously authorized sessions are restored when possible without storing access tokens in the browser.
- **Local backup:** Export and import app settings as a JSON file. This is a manual file transfer, not cloud synchronization.

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the URL shown by Vite, normally `http://localhost:5173`.

To test on a phone on the same Wi-Fi network, open the network URL printed by Vite.

## Project

Source code: [github.com/kaasschaaf/MyTube](https://github.com/kaasschaaf/MyTube)
