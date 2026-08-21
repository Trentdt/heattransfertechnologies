# Heat Transfer Technologies — Website Source

This is a single self-contained file: `index.html`. There's no build step,
no `npm install`, no framework — everything (styles, the icon set, the
company logo, and all page navigation) lives in that one file. This is a
different, more capable version of the site than the multi-page build that
was here before, and it replaces it.

## What changed from the previous version

The earlier version of this repo used a small Node build script
(`build.js`) to assemble multiple HTML pages with clean URLs
(`/about/`, `/equipment/`, etc.). This version is a single-page app: one
`index.html` that swaps visible sections in and out as you navigate, using
URL hashes (`#/about`, `#/equipment/cooling-towers`) instead of separate
pages. It also adds a lot that the previous version didn't have:

- Sub-pages for every equipment category and every market served
- A live heat-transfer equations reference with a working unit converter
- A selection tool that calculates heat load, tower approach, exchanger
  duty (with LMTD and TEMA F-correction), and chiller sizing from your
  inputs, accounting for glycol concentration
- An interactive, clickable US map for territory/coverage lookup
- A left sidebar navigation with expandable equipment/markets submenus

Because it's one static file with everything inlined (including the logo,
as embedded image data — no external image files to lose track of), it's
actually *simpler* to host than the old multi-page build. See "Going live"
below — it fixes the GitHub Pages issue you were running into, because
there's no build step for GitHub to run in the first place.

## Previewing it

Two ways, both work with zero setup:

1. **Just double-click `index.html`.** Because navigation uses URL
   hashes rather than server routes, the whole site — including page
   switching — works straight off your local disk with no server needed.
2. Or serve it locally: `npx serve .` (or `python3 -m http.server 8080`)
   from this folder, then open the printed URL. Only meaningfully
   different from option 1 if you want to test it the way a real host
   will serve it.

## Going live

### On GitHub Pages (what you were setting up)

This fixes the "preview shows only the README" problem you hit, because
that was caused by GitHub Pages needing a build step it wasn't finding —
there is no build step now.

1. Push this folder's contents to your repo (`index.html`, `robots.txt`,
   `sitemap.xml`, this `README.md`).
2. Repo → **Settings → Pages** → under "Build and deployment," set
   **Source** to **Deploy from a branch**, branch **main**, folder **/
   (root)**.
3. Save. GitHub builds nothing — it just serves `index.html` — so it
   should go live within a minute or two. The URL will be
   `https://<your-github-username>.github.io/<this-repo-name>/`.
4. If you still have `.github/workflows/pages.yml` in the repo from the
   previous version, you can delete it — it's for the old build-based
   setup and isn't needed anymore. It won't break anything if you leave
   it, it'll just run pointlessly on every push.

### On Netlify (when you're ready to point the real domain at it)

1. **Drag-and-drop (fastest):** go to `app.netlify.com/drop` and drag
   this folder onto the page. You get a live `*.netlify.app` URL
   immediately.
2. **Or connect GitHub** (auto-deploys on every push): Netlify → Add new
   site → Import an existing project → GitHub → select this repo. No
   build command needed — set the publish directory to `/` (repo root)
   since there's nothing to build.
3. When you're ready, Netlify's domain settings will show the exact DNS
   records to point `heattransfertech.com` at it.

### Anywhere else

It's plain HTML/CSS/JS with no server requirements — Vercel, Cloudflare
Pages, S3+CloudFront, or literally any static file host works by just
uploading `index.html`.

## Before this is fully publish-ready

The site is functionally complete, but several places intentionally show
an orange-flagged **[PLACEHOLDER]** rather than invented information —
impossible to miss if you preview the site. Send me the real details for
any of these and I'll drop them straight in:

1. **Company contact info** — street address, city/state/ZIP, main
   phone, email, hours (Contact page, and repeated in the footer).
2. **Leadership bios** — the About page has one sample entry using your
   name; needs a real title and background, plus any other leaders you
   want listed.
3. **Territory assignments** — the coverage map currently has a working
   *guess* at which states belong to which of four regions (Mid-Atlantic,
   Great Lakes, Northeast, Southeast), with your name as a placeholder
   rep for all four and `[PLACEHOLDER]` phone/email on each. This needs
   real territory boundaries and real rep names/contact info — it all
   lives in one editable list near the top of the `<script>` block
   (search for `TERRITORIES` and `STATES`), so updating it is a quick
   edit once you send the real assignments.
4. **Project case studies** — currently three scaffolded template cards;
   needs real project details (client/industry — can be anonymized,
   challenge, equipment supplied, outcome).
5. **Contact form backend** — the form on the Contact page is UI-only
   right now (it shows a note that it isn't connected to anything).
   Once you pick a host, I can wire it to that host's form handling
   (Netlify Forms is free and simplest if you deploy there) or to a
   service like Formspree.
6. **Supplier/brand names** — a couple of equipment pages note that
   naming specific manufacturer lines you have rights to display would
   strengthen the page; send those once confirmed.

## A structural tradeoff worth knowing about

Because every "page" is really one file with JavaScript swapping which
section is visible, search engines and social-share previews only ever
see the Home page's `<title>` and meta description — there's no
per-page SEO metadata the way the old multi-page build had (each page
there got its own title, meta description, and URL that Google could
index separately). For a small industrial B2B site where most traffic
will come from direct referral, word of mouth, and the domain itself
rather than long-tail search, that's a reasonable tradeoff for what you
gain in interactivity and content depth — but if organic search ranking
for specific equipment/market terms becomes a priority later, that's the
first thing to revisit (either by adding routes with real URLs and
server-rendered metadata per page, or by generating a set of lightweight
static landing pages that link into this app for the pages that matter
most for SEO). Flagging it now rather than after the fact.

## Editing content or data

Everything is inline in `index.html`:

- **Page copy** — search for the page's heading text or its `id="p-..."`
  wrapper `<div>` to jump to that section.
- **Colors/branding** — CSS custom properties at the top of the
  `<style>` block (`--navy`, `--red`, etc.).
- **Site data that drives the tools** (unit converter rows, fluid
  properties, equipment/selection-tool fields, territories, state
  assignments) — one clearly labeled configuration block near the top of
  the `<script>` at the bottom of the file. Comments there explain each
  section.
