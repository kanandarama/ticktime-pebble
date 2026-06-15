# TickTime setup checklist

Complete the items marked **you** — the rest is already done locally.

## Done automatically

- [x] `npm install` (`@moddable/pebbleproxy` installed)
- [x] `src/pkjs/config.js` created (placeholders — fill in below)
- [x] Git repository initialized in `ticktime-pebble/`
- [x] OAuth callback page in `docs/index.html`
- [x] GitHub Actions workflow for Pages (`.github/workflows/pages.yml`)

## 1. GitHub repo + Pages **you**

`gh` CLI is not installed on this machine, so create the repo manually:

1. Open https://github.com/new
2. Repository name: **ticktime-pebble**
3. Create repository (public is fine)
4. In your terminal:

```powershell
cd "C:\Users\anand.kuchibhatla\Downloads\Personal\Vibe Coding\TickTick Wrapper\ticktime-pebble"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ticktime-pebble.git
git push -u origin main
```

5. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**
6. After the workflow runs, your OAuth URL is:

```
https://YOUR_USERNAME.github.io/ticktime-pebble/
```

## 2. TickTick developer app **you** (requires your TickTick login)

1. Open https://developer.ticktick.com/manage
2. **New App** → name: `TickTime`
3. Set **OAuth Redirect URL** to your GitHub Pages URL (step 1.6) — trailing slash matters
4. Copy **Client ID** and **Client Secret**

## 3. Fill in config.js **you**

Edit `src/pkjs/config.js`:

```javascript
module.exports = {
  CLIENT_ID: "paste_client_id",
  CLIENT_SECRET: "paste_client_secret",
  REDIRECT_URI: "https://YOUR_USERNAME.github.io/ticktime-pebble/"
};
```

Re-build/re-install the app on CloudPebble after changing this file.

## 4. CloudPebble **you**

1. Open https://cloudpebble.repebble.com
2. Sign in
3. **New Project** → type **Alloy / moddable** → platform **emery**
4. Import from GitHub (`ticktime-pebble`) or upload project files
5. Build → test in emulator
6. Install to watch (rePebble app → Dev Connect → GitHub)

## 5. First login on watch **you**

1. TickTime → **Settings → Connect TickTick**
2. Approve in phone browser
3. Copy auth code from GitHub Pages callback
4. **Settings → Enter Auth Code** on watch
5. **Sync Now**

---

**Optional:** Install GitHub CLI (`winget install GitHub.cli`) so future pushes and repo creation can be automated.
