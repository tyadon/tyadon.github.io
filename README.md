# treyyadon.space

TreyOS: Trey Yadon's personal site, a 1-bit desktop where each part of life is an app.
Jekyll on GitHub Pages; pushing to `main` publishes.

## Write a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-short-title.md`:

```markdown
---
title: The title
description: One sentence for link previews.
---

Your post.
```

Push to `main`. It shows up at `https://treyyadon.space/notes/short-title/` and in the Notes app.

## Change site content

Everything on the desktop (ReadMe, projects, Archive, Cellar, Maps, Bookshelf, Garage,
Newton, Mail, Trash, photo captions) lives in `_data/content.json`.

## Preview locally

```sh
scripts/serve.sh   # http://localhost:4000
npm test           # builds the site and runs the tests
```

Note: the local preview talks to the live guestbook and counter.

## Guestbook and counter

`server/` is a separate Vercel project (`treyos-api`, https://api.treyyadon.space) backed by a
free Neon database. Database rules: `server/schema.sql`. Deploy: `cd server && vercel deploy --prod`.
Live checks: `scripts/verify-api.sh`. Delete a guestbook entry from the Neon console.
