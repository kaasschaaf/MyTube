# MyTube 🎬⏱️ - YouTube Subscriptions Filter

Een moderne webapplicatie (geschikt voor PC, Mac, tablet en smartphone/PWA) waarmee je je YouTube-abonnementen kunt filteren op **videoduur** (bijv. *"Ik heb nog 15 minuten"*), **favorieten** en **prioriteiten**, verpakt in de vertrouwde **YouTube Dark UI**.

Ontworpen om direct gehost te worden via **GitHub Pages** als pure statische Single Page App (SPA).

---

## ✨ Belangrijkste Functionaliteiten

1. ⏱️ **Filteren op Videolengte ("Ik heb nog X minuten")**:
   - Snelle filterchips: `≤ 5 min`, `≤ 10 min`, `≤ 15 min`, `≤ 30 min`, `≤ 45 min`, `45+ min`.
   - Vrije tijd-slider: Stel exact je beschikbare tijd in (bijv. 12 minuten) voordat je de deur uit moet.
   - Exacte YouTube-stijl tijdsbadges op elke thumbnail.
2. ⭐ **Favorieten & Kanaalbeheer**:
   - Geef kanalen een ⭐-markering om ze als favoriet aan te merken.
   - Filter met 1 klik op *Alleen favorieten*.
   - Demp (mute) minder leuke kanalen zonder te hoeven ontvolgen op YouTube.
3. 📱 **Perfect op PC & Smartphone (PWA)**:
   - **Desktop**: YouTube-grid (3-4 kolommen) met inklapbare navigatie-sidebar.
   - **Mobiel**: Single-column feed met YouTube Mobile bottom navigation bar.
   - **PWA**: Voeg toe aan je beginscherm op iOS (Safari) of Android (Chrome) voor een app-ervaring zonder browserbalken.
4. 🔐 **Google Account Koppeling (OAuth 2.0)**:
   - Direct inloggen via Google Identity Services Token Client (client-side, 100% veilig zonder backend).
   - Automatische synchronisatie van al je abonnementen en recente uploads.
5. 💾 **Backup & Synchronisatie tussen Apparaten**:
   - 1-klik JSON Export & Import om je favorieten en instellingen eenvoudig over te zetten van je computer naar je telefoon.

---

## 🚀 Lokaal Draaien

1. **Installeer afhankelijkheden**:
   ```bash
   npm install
   ```

2. **Start de ontwikkelserver**:
   ```bash
   npm run dev
   ```
   De applicatie is nu bereikbaar op `http://localhost:5173`.

3. **Openen op je telefoon (via lokaal Wi-Fi netwerk)**:
   Omdat `vite.config.ts` is ingesteld met `host: '0.0.0.0'`, toont de terminal direct een Network URL (bijv. `http://192.168.1.15:5173`). Open deze link in de browser op je smartphone!

---

## 🌐 Publiceren naar GitHub Pages

Deze repository bevat een geautomatiseerde **GitHub Actions workflow** (`.github/workflows/deploy.yml`).

1. **Maak een repository aan op GitHub** (bijv. `mytube`).
2. **Koppel je lokale repository en push de code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of MyTube"
   git branch -M main
   git remote add origin https://github.com/<jouw-gebruikersnaam>/mytube.git
   git push -u origin main
   ```
3. **Schakel GitHub Pages in**:
   - Ga op GitHub naar je repository &gt; **Settings** &gt; **Pages**.
   - Selecteer bij **Build and deployment > Source**: **GitHub Actions**.
   - Binnen enkele minuten staat je app live op:
     `https://<jouw-gebruikersnaam>.github.io/mytube/`

---

## 🔑 Google OAuth Instellen (Optioneel voor eigen abonnementen)

Standaard bevat MyTube een **rijke demo-feed** met kanalen zoals Veritasium, MKBHD, Kurzgesagt, NOS op 3 en Tweakers, zodat alles direct werkt.

Wil je je **eigen YouTube-account** koppelen:
1. Ga naar de [Google Cloud Console](https://console.cloud.google.com).
2. Maak een gratis project aan en activeer de **YouTube Data API v3** (*APIs & Services > Library*).
3. Ga naar *Credentials* &gt; *Create Credentials* &gt; *OAuth client ID* (kies: **Web application**).
4. Voeg bij **Authorized JavaScript origins** toe:
   - `http://localhost:5173` (voor lokaal testen)
   - `https://<jouw-gebruikersnaam>.github.io` (voor je GitHub Pages site)
5. Plak je **Client ID** in het instellingenmenu van MyTube en klik op **Inloggen met Google**!
