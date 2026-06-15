# TickTime

**Unofficial TickTick client for Pebble Time 2**

TickTime lets you browse, complete, create, and manage TickTick tasks from your Pebble Time 2 watch.

## Features

- Smart views: Today, Tomorrow, Overdue, All Tasks
- Browse tasks by project
- Complete and delete tasks
- Toggle subtasks
- Quick-add tasks with preset titles
- Sync tasks via TickTick Open API
- Offline cache of last sync

## Prerequisites

- Pebble Time 2 (`emery`) with rePebble app on your phone
- TickTick account (Premium optional)
- [CloudPebble](https://cloudpebble.repebble.com) account
- TickTick developer app at [developer.ticktick.com/manage](https://developer.ticktick.com/manage)
- GitHub account (for Dev Connect and optional OAuth callback hosting)

## Setup

### 1. Register TickTick developer app

1. Go to [TickTick Developer Center](https://developer.ticktick.com/manage)
2. Create a new app
3. Copy **Client ID** and **Client Secret**
4. Set **OAuth Redirect URL** to your GitHub Pages callback (see step 2)

### 2. Host OAuth callback page (free)

Deploy `oauth-callback/index.html` to GitHub Pages:

```
https://yourname.github.io/ticktime-oauth/
```

Use the same URL as `REDIRECT_URI` in TickTick and in `config.js`.

After login, the page shows your auth code. On the watch: **Settings → Enter Auth Code**.

### 3. Configure phone-side credentials

```bash
cp src/pkjs/config.example.js src/pkjs/config.js
```

Edit `src/pkjs/config.js` with your Client ID, Client Secret, and Redirect URI.

**Never commit `config.js`** — it is gitignored.

### 4. Build with CloudPebble

1. Open [cloudpebble.repebble.com](https://cloudpebble.repebble.com)
2. Create new project → **Alloy / moddable** → target **emery**
3. Import this repo or paste the files
4. Run `npm install` (or add `@moddable/pebbleproxy` dependency in CloudPebble)
5. Build and test in the **emery** emulator (200×228)

### 5. Install on your watch

1. Install [rePebble app](https://repebble.com/app) on your phone
2. Pair your Pebble Time 2
3. Enable **Dev Connect**: Devices → ⋮ → Enable Dev Connect → sign in to GitHub
4. In CloudPebble, click **Install** or use `pebble install --cloudpebble`

## First-time login

1. Open **TickTime** on your watch
2. Go to **Settings → Connect TickTick** (opens phone browser)
3. Log in to TickTick and approve access
4. Copy the auth code from the callback page
5. On watch: **Settings → Enter Auth Code**
   - **Up**: cycle character
   - **Select**: add character
   - **Down**: submit code
   - **Back**: delete character / go back
6. Tap **Sync Now** on the home screen

## Auth code entry (watch buttons)

| Button | Action |
|--------|--------|
| Up | Next character |
| Select | Add current character |
| Down | Submit code |
| Back | Delete last character |

## Project structure

```
ticktime-pebble/
├── package.json
├── oauth-callback/index.html   # GitHub Pages OAuth redirect
├── src/
│   ├── embeddedjs/             # Watch app (Alloy / Piu UI)
│   └── pkjs/                   # Phone companion (OAuth + network proxy)
```

## API scope

Uses the official [TickTick Open API](https://developer.ticktick.com/docs#/openapi):

- Projects: list, view, create, update, delete
- Tasks: list, create, update, complete, delete
- Subtasks, priority, due dates, reminders (read/write where API supports)

**Not yet supported** (planned via V2 API): Inbox, tags, habits, pomodoro.

## Publishing

When ready to share on the Rebble app store:

- Title: **TickTime**
- Subtitle: *Unofficial TickTick client for Pebble*
- State clearly: not affiliated with TickTick or Doist
- Do not use TickTick logos

## License

Personal / unofficial project. TickTick is a trademark of its respective owners.
