# TreyOS: tyadon.github.io redesign

Date: 2026-11-05
Repo: github.com/tyadon/tyadon.github.io (GitHub Pages, deploys from `main`)

## Intent

Trey's personal site, rebuilt as a retro 1-bit desktop computer ("TreyOS"). Each part of
his life is an application on the desktop. The goal is a personal brand: a site that is
fun to poke around, says who he is, and gives him a place to publish a blog. It is
**not** a job-search site or a résumé.

Why now: the current site (single `index.html`, Feb 2026) is stale. It shows OpSpring as
current, describes Pour Memory as SwiftUI/Firebase, links an OpSpring email, and renders
six empty photo placeholders.

## Goals

- Feels like a real, playful retro OS: boot, desktop icons, windows that open, drag,
  stack and close, pixel details, good stepped (not smooth) animations.
- Every part of Trey's life gets an app (list below).
- A blog he will actually use: posts are Markdown files in the repo.
- Every blog post also has a normal, shareable, crawlable URL that renders as a plain
  article without the OS chrome, so posts can be shared on LinkedIn and indexed.
- Works well on a phone.
- Fast, no framework, nothing to maintain beyond writing posts.

## Non-goals

- No résumé, no "hire me", no job-search framing.
- No mention of OpenAI or Trey's current employer.
- No mention of Schyler anywhere on the site.
- No sports betting content.
- No analytics or tracking beyond the public hit counter.

## Anti-goals (would make it a failure even if it works)

- Looks like a generic AI-built portfolio (Inter, purple gradients, card grids).
- The gimmick gets in the way: visitor can't find the projects, the posts, or how to
  reach him within a few seconds.
- Broken or unusable on mobile.
- Copy that sounds like marketing or invents facts.
- Recreating a real OS's branding (no Apple logo, no "Macintosh", no Windows logos).
  TreyOS is its own made-up system that borrows the 1-bit era's look.

## Decided with Trey

- **Direction:** "Desktop '89": a 1-bit black and white desktop, dithered patterns,
  striped title bars, hard shadows, pixel-stepped animations. Chosen over a CRT terminal
  and a game-cartridge concept (mockups in `.superpowers/brainstorm/`).
- **Apps that represent his projects** keep their brand colors inside their windows
  (Who's Got It green `#0a8f63` range, Pour Memory oxblood `#74291e` range) and use
  **real screenshots**. Screenshots start dithered 1-bit and "develop" into color.
- **Email link:** itstreyyadon@gmail.com.
- **Photo grid:** the old empty grid is gone; photos live in the Darkroom app.
- **Pour Memory stack:** React Native + Expo (+ Next.js web). Not SwiftUI/Firebase.
- **Copy rules:** no em-dashes anywhere, no invented facts, no sales register.
  Archive lines may be written by the builder from the facts below, then shown to
  Trey for a check.

## The apps

| App | What it is | Content source |
|---|---|---|
| **ReadMe** | Opens on first boot. Short intro in Trey's voice. | Facts below |
| **Who's Got It** | Project window, green. Pitch, how it works, stack, App Store + site links, screenshots. | LinkedIn copy (below); 7 App Store screenshots |
| **Pour Memory** | Project window, oxblood. Pitch, role (co-founder, CTO), stack, link, screenshots. | LinkedIn copy; 5 App Store slides + 1 raw screenshot |
| **Archive** | "Past lives" folder. One icon per chapter, each opens a short card. Story, not résumé. | Facts below |
| **Darkroom** | Photo gallery. Thumbnails dithered; opening a photo develops it to full color. | 28 photos from his Europe shared albums |
| **Cellar** | The last 7 wines he logged in Pour Memory, drawn as pixel-art bottles. | List below |
| **Maps** | His favorite San Diego restaurants on a stylized 1-bit map of SD. | List below |
| **Bookshelf** | Currently reading. | *Crime and Punishment* |
| **Garage** | His bike. | 2024 Ducati Monster Plus |
| **Notes** | The blog, shown as a notes/text-file app. | Markdown posts |
| **Newton.exe** | Newton as a pixel-art desktop pet that wanders the desktop; clicking him opens a window with his real photo. | `~/Desktop/IMG_1798.jpeg` (snow, ski goggles) |
| **Terminal** | Easter egg with a handful of commands (`help`, `whoami`, `ls`, `cat`, `open <app>`, a few hidden ones). | Builder |
| **Trash** | Abandoned ideas, self-aware and funny. | Linkswag, site v1 (see below) |
| **Guestbook** | Visitors sign it. | Supabase (see below) |
| **Mail** | Email, LinkedIn, GitHub. | Below |
| **Control Panel** | Desktop pattern, 1-bit vs color mode, CRT filter toggle, sound on/off. | Builder |
| **Hit counter** | Classic visitor counter in the menu bar or ReadMe footer. | Supabase (see below) |

### Facts to write from

- Trey Yadon, San Diego, California. Builder. Photographer (Fuji X100VI). Rides a 2024
  Ducati Monster Plus. Dog: Newton, Samoyed mix, born September 2014.
- **Microsoft**, Technical Program Manager, Oct 2017 to Jun 2025, Seattle area: shipped
  the Windows updates that go to every Windows device, then ran Windows OS delivery across
  Azure infrastructure. Coordinated release triage and security disclosures. Led the
  Windows Hotpatch (rebootless patching) pilot on internal Azure services.
- **No internships on the site** (GE Aviation, JPMorgan Chase, Microsoft 2015). This is a
  personal brand site, not a résumé. Don't state Trey's age on the site.
- **Felt**, Principal Engineer, Core Systems, Oct 2014 to Aug 2017, Telluride CO: sole
  backend engineer for an app that sends real handwritten cards from your phone. Scaled
  the infrastructure for the company's Shark Tank appearance. (Shark Tank is its own
  Archive entry.)
- **CRE8R Club**, Feb to Aug 2026: vetted dinner club matching creators into curated 4 to 6
  person dinners twice a month, live in Austin, LA and San Diego. Trey built the full-stack
  platform: multi-city landing pages with subdomain routing, geo-based visitor detection,
  a waitlist flow, and a config system where launching a city is adding a file.
- **RIT** (Rochester Institute of Technology): played lacrosse. Sole iOS developer on
  Commons. Front-end on Linkswag (web).
- **OpSpring** (from Jul 2025; no end date on the site): co-founded an AI solutions studio for small
  businesses, built ProducerHQ (AI workspace for independent insurance agencies). Past
  tense only. Optional Archive entry.
- **Who's Got It** (May 2025 to present): Trey is the solo founder and built all of it.
  Take a photo of the receipt, an AI model reads
  the items, tax and tip, text the group a link; friends open it in the browser, tap what
  they ordered, pay on Venmo. No download, no account. Payments show up live. Trips mode:
  everyone adds bills along the way, claims what they had, and the app works out the
  fewest payments to settle. React Native (Expo) + TypeScript on iOS, Next.js web,
  Supabase. Live on the App Store:
  https://apps.apple.com/us/app/whos-got-it/id6775676276 and https://whosgotit.app
- **Pour Memory** (Jan 2025 to present): wine journal that pairs a physical notebook and
  writable bottle labels with an app. Trey is co-founder and CTO and builds the React
  Native (Expo) iOS app (label scanning, memory logging, personal cellar) and the web
  platform. https://pourmemory.com
- Links: GitHub https://github.com/tyadon, LinkedIn https://www.linkedin.com/in/ryadon,
  email itstreyyadon@gmail.com.

### Cellar list (newest first)

Use the wine names only. Do not use Trey's photos or his memory titles. Draw each bottle
as pixel art loosely based on its real label; it doesn't need to be exact.

1. Donnafugata Sedàra (Sicily), Oct 26
2. La Vela Bolina (Catania), Oct 25
3. Antek (Catania), Oct 25
4. Camarda Nerello Mascalese, Oct 23
5. Pitanga (Siracusa), Oct 22
6. Le Fontane Cerasuolo di Vittoria Classico, Oct
7. Kaid Syrah, Monreale, Oct 20

Label cues from Trey's screenshot: Sedàra red label with painted face; Bolina dark bottle
with gold script; Antek white label with a red square; Camarda cream label with a line
drawing of flowers; Pitanga black label with a white line drawing; Le Fontane cream label
with red diamonds; Kaid black label with gold lettering.

### Maps list (San Diego)

Mikiya Shabu, Flamma Llama, Cesarina, It's Raw Poke, Koon Thai, Tacos El Gordo, Mitch's
Seafood, Animae. The builder looks up each location (neighborhood is enough) and confirms
exact names/spelling before placing pins.

## Assets on disk

- App icons (1024px): `~/repos/whosgotit-mobile/assets/images/icon.png`,
  `~/repos/Pour Memory/Assets/Assets.xcassets/AppIcon.appiconset/appicon.png`
- Who's Got It screenshots: App Store, via
  `https://itunes.apple.com/lookup?id=6775676276` (`screenshotUrls`, request
  `1290x2796bb.jpg`). Downloaded copies in `.superpowers/assets/wgi/` (gitignored).
- Pour Memory screenshots: `~/repos/pour-memory/public/images/app-store-slide-*.jpg`,
  `app_screenshot.jpg`
- Darkroom photos: 28 picks in `.superpowers/assets/darkroom/` (gitignored). Source is
  Apple Photos shared albums. Some are only ~540px; that's acceptable because they
  display dithered and in windows. Photos of other identifiable people were left out.
  **Never show the album names** (they name other people).
  *Builder's call (mine):* each photo gets a city-level caption only (Prague, Paris,
  Amsterdam, London, Dublin, Vienna...), identified from the image or GPS before
  stripping. No dates, no precise places.
- Newton: `.superpowers/assets/newton/IMG_1798.jpeg`. (Do not use `IMG_3613.jpg`; it
  contains private documents.)

All published images get resized and EXIF/GPS-stripped before they go in the repo.

## Constraints

- Hosting: GitHub Pages, public repo. Static only. Anything dynamic (guestbook, hit
  counter) needs a free third-party service.
- Blog authoring must be "add a Markdown file and push". Trey should not need a local
  build step. (Jekyll is native to GitHub Pages, so it fits; the builder decides.)
- `docs/` and `.superpowers/` must not be published or must be excluded from the build.
- Fonts and scripts self-hosted or from allowed CDNs; keep total page weight sensible
  (photos lazy-loaded).
- `prefers-reduced-motion` disables boot and decorative animation.
- Keyboard accessible; real text (not images of text); content readable by crawlers
  (a no-JS fallback that lists the apps and their content is enough).

## Mobile

On narrow screens the desktop becomes a grid of icons; apps open as full-screen windows
with a close bar. Newton still wanders along the bottom. No dragging on touch.

## Left to the builder

- Implementation (vanilla JS window manager vs. a tiny library; Jekyll vs. another
  static approach), file structure, deep-link URL scheme for apps.
- Exact boot sequence, sounds (default off), icon pixel art, desktop pattern.
- Terminal commands and easter eggs.
- Archive copy, written from the facts above, no em-dashes, shown to Trey.
- First blog posts: adapt 2 to 3 of Trey's LinkedIn posts (AI design convergence, "work
  with a ceiling", AI fluency) as starter posts, flagged for his review.

## Release (my call)

Nothing is pushed to `main` until Trey has walked a local preview and approved it,
including the Archive copy and starter posts. Any app whose content or backend is still
undecided at that point (Guestbook, hit counter, Trash) ships hidden rather than as a
"coming soon" stub, and is added in a follow-up push.

## Source text

Project windows are written from the LinkedIn project copy, which is quoted verbatim in
the facts above (Who's Got It, Pour Memory, CRE8R). Starter posts are adapted from
Trey's own LinkedIn posts, saved verbatim in `docs/superpowers/specs/linkedin-posts.md`.
Adapting means light edits for a blog format, never new claims.

## Guestbook and hit counter (decided)

- Backend: **Supabase**, free tier, via the existing Supabase CLI login. Trey's org
  (Vercel-integrated) already has two active projects, `supabase-splititnow` and
  `legwork`. Do not put site tables in either. Create a new project for the site; if the
  free tier refuses a third active project, stop and ask Trey (don't pause or upgrade
  anything on your own).
- Guestbook entries: name (required), message (required, length-limited), optional
  website. No email collected. Entries appear immediately. Spam defenses: honeypot field,
  per-IP rate limit enforced server-side, length limits, basic profanity filter. Trey
  deletes entries from the Supabase dashboard. Writes go through a Postgres function or
  Edge Function, never a table open to anonymous inserts.
- Hit counter: one atomic increment per visit (once per browser session), displayed as a
  retro odometer. No cookies, no IPs stored.
- The anon key in client code is expected; RLS must make it read-only except through the
  functions above.

## Domain (decided)

- Trey bought **treyyadon.space** through Vercel (2026-11-05). DNS is managed in Vercel.
- Hosting stays on **GitHub Pages** (push-to-publish, Jekyll-native). Vercel DNS points the
  apex and `www` at GitHub Pages; the repo gets a `CNAME` file and HTTPS is enforced.
  `tyadon.github.io` redirects to the custom domain automatically.
- Canonical and Open Graph URLs use https://treyyadon.space from the first release.

## Trash (decided)

- **Linkswag** (RIT): be on any website and share a link into a centralized message board
  where friends could comment on it. A bit ahead of its time. Tone: affectionate, "the
  idea was right, the year was wrong".
- **This website, v1**: the Feb 2026 version (particle background, typing effect),
  replaced by TreyOS. Self-aware entry.
- Trey may add more later. No betting app.

## Not in v1

- Vibe directing app (no answer; leave out, easy to add later).
