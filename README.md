# Open Debate — React Debate Platform Starter Kit

A polished React starter kit for building a topic-based debate and discussion experience. The English edition includes a warm ivory-and-gold interface, responsive layouts, light/dark themes, sample discussions, and interactive client-side flows.

> **Important:** This is a front-end starter kit and local demo, not a hosted social network. It does not include a backend, shared database, production authentication, real-time messaging, or server-side moderation. Each browser keeps its own local demo data.

## What is included

- Debate discovery, keyword search, and category filters
- Debate creation and open-participant flow
- Side selection, voting, discussion messages, comments, and reactions
- Debate and user ranking screens
- Local demo profiles and follow flows
- In-app notifications and invitations (local demo state)
- Report submission and a demo moderation dashboard
- Responsive navigation and light/dark theme support
- Fictional sample debates, messages, and comments for first-run previews
- Vite deployment configuration

## Tech stack

- React 18.3
- TypeScript / TSX
- Vite 6
- Tailwind CSS 4
- React Router 7
- Radix UI primitives
- Lucide React icons

## Requirements

- Node.js 20 or later
- npm 10 or a compatible recent npm release

Check your versions:

```bash
node --version
npm --version
```

## Quick start

Open a terminal in the project folder and run:

```bash
npm install
npm run dev
```

Vite prints a local URL (normally `http://localhost:5173`). Open that URL in your browser.

Create and preview a production build:

```bash
npm run build
npm run preview
```

The production files are written to `dist/`. Package versions are pinned in `package.json`. This archive does not include an npm lockfile, so generate and commit one with `npm install` before maintaining the project or making repeatable releases.

## Demo content and local storage

The first run seeds six fictional sample debates plus sample messages and comments. These are included to make the interface easy to evaluate; they do not represent real users or live conversations. The demo seed runs once per browser using the `openDebateDemoSeedVersion` localStorage key.

Usernames, debates, votes, messages, comments, reactions, reports, follows, notifications, and invitations are stored in the current browser's `localStorage`. They are not sent to a shared application database and do not sync between users, browsers, or devices. Clearing the site's browser storage resets the demo.

The sign-in screen only asks for a display name. It is **not** secure account authentication. The Admin screen's name-based access check is also a demo convenience, not a security boundary. Do not use this implementation to protect private data or administrative actions in a public production app.

## Before using this as a real service

Connect and test your own backend before presenting the app as a multi-user service. At minimum, plan for:

1. A database and server/API layer for users, debates, votes, messages, comments, and reports.
2. Secure authentication and server-side authorization, including real admin roles.
3. Server-side validation, rate limits, abuse prevention, and moderation workflows.
4. A privacy policy and terms that accurately describe your hosting, analytics, and data handling.
5. Security, accessibility, responsive-layout, and cross-browser testing.

The included Terms of Service screen is sample wording only. It is not legal advice and must be reviewed and adapted for the operator's jurisdiction and actual service behavior before launch.

## Deploying to Vercel

1. Import the project repository into Vercel.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to the folder containing this `package.json`.
4. Use `npm run build` as the Build Command.
5. Use `dist` as the Output Directory.
6. Deploy, then test the deployed site on desktop and mobile.

If you deploy from a repository subfolder, make sure the Root Directory points to this project folder rather than the repository root.

## Project scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |

## Credits and licenses

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for third-party component and image credits. Review the licenses for all dependencies and assets before redistributing a customized product. A draft customer license is included in [LICENSE_TEMPLATE.md](./LICENSE_TEMPLATE.md); it is a starting point only and must be reviewed and adapted before sale. No legal advice is provided.

## Troubleshooting

- **`npm` is not recognized:** Install Node.js 20 or later, then reopen the terminal.
- **The dev server uses a different port:** Vite automatically selects another available port and prints it in the terminal.
- **Old sample content is not visible:** Clear this site's `localStorage` in browser developer tools and reload. This also removes any demo activity stored in that browser.
- **Vercel shows a 404:** Confirm that the Root Directory contains this `package.json` and `index.html`, then redeploy.

---

Open Debate is provided as an editable starter project. Review the code, dependency licenses, assets, and product claims before using or redistributing it.
