# Seller QA Checklist

Use this checklist before publishing a customer download. Mark each item only after it has been tested.

## Installation and build

- [ ] Install Node.js 20+.
- [ ] Run `npm install` from a clean copy of the project.
- [ ] Generate and retain `package-lock.json`.
- [ ] Run `npm run build` and confirm it completes without errors.
- [ ] Run `npm run preview` and open the local preview.

## Core flows

- [ ] Home page loads with the six sample discussions.
- [ ] Category filters and keyword search work.
- [ ] Open-participant flow works after entering a nickname.
- [ ] Debate detail pages load seeded messages and comments.
- [ ] Voting, reactions, comments, and new debate creation work.
- [ ] Profile, ranking, notifications, invitations, and report screens behave as documented.
- [ ] Theme switching works.
- [ ] Layout is checked at mobile, tablet, and desktop widths.

## Release hygiene

- [ ] No `.env` files, API keys, passwords, or private data are included.
- [ ] `node_modules/`, `dist/`, `.git/`, and local editor files are excluded from the source archive unless intentionally needed.
- [ ] All third-party licenses and asset permissions have been reviewed.
- [ ] The customer license and refund policy have been reviewed.
- [ ] The product description accurately says that the app is local-only and has no backend or cross-user sync.
- [ ] The screenshots and demo video show the actual build being sold.
