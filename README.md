# Heat Transfer Technologies — Website Source

Plain HTML/CSS/JS site, assembled by a small zero-dependency Node build
script. No framework, no npm install required, no vendor lock-in — the
output in `dist/` is flat static files that will run on literally any web
host.

## What's new in this update

Same architecture and file layout as before (this drops straight into your
existing repo — see "Uploading this into your existing GitHub repo" below),
with a visual and interaction upgrade on top:

- A hand-built inline SVG icon set (no external icon library/CDN) used
  across feature cards, equipment categories, market sections, and the new
  process steps
- A more detailed hero treatment (layered gradient + subtle blueprint-grid
  texture) and a qualitative capability badge row
- A new "How We Work" 3-step section on the Home page
- Scroll-reveal animations as sections come into view — implemented so
  content is **fully visible by default**; the animation only activates
  once JS confirms it can run, so a slow network, blocked script, or
  disabled JS never hides real content (verified — see note below)
- The contact form now submits via JS (fetch) with an inline success/error
  message instead of a full-page reload, while still falling back to a
  normal POST if JS is unavailable
- A back-to-top button, a scroll-elevated header, and `aria-current`/
  focus-visible states added for accessibility
- Respects `prefers-reduced-motion` — users with that OS setting see no
  animation at all, content is simply present

Before packaging this, I ran it through an automated check (link/anchor
integrity, HTML tag balance, icon-reference integrity, JS behavior with a
headless browser) including a specific test with JavaScript **disabled
entirely** to confirm no content depends on JS to be visible or readable.

## Uploading this into your existing GitHub repo

You already have a repo connected to Netlify. This zip mirrors that same
file structure exactly, so updating is a straight overwrite:

1. Extract this zip somewhere on your computer.
2. On GitHub, open your repo and delete the old `src/`, `assets/`,
   `build.js`, `package.json`, `netlify.toml`, `robots.txt`, and
   `sitemap.xml` (or just skip this — uploading files with the same path
   replaces them in place, so deleting first isn't strictly necessary).
3. Use "Add file → Upload files" at the repo root and drag in everything
   from the extracted folder **except `dist/`** (Netlify rebuilds that
   fresh on every deploy from source, so it doesn't need to live in the
   repo). GitHub will show you it's replacing the matching existing files.
4. Commit directly to `main`.
5. Netlify picks up the push automatically and redeploys — no settings to
   change, since `netlify.toml` (build command `node build.js`, publish
   `dist`) is identical to what's already there.

If GitHub Desktop is easier for you than the web uploader, same idea: pull
your existing repo, copy these files over the old ones, commit, push.

## What's in here

```
src/layout.html          Shared header/nav/footer template + icon sprite
src/pages/*.content.html One file per page's body content
assets/css/styles.css    All site styling (brand colors as CSS variables)
assets/js/main.js        Mobile nav, sticky CTA, back-to-top, scroll-reveal,
                          AJAX contact form submission
build.js                 Assembles layout + content -> dist/
robots.txt, sitemap.xml  Copied into dist/ as-is
netlify.toml             Build config if you deploy via Netlify + Git
```

## Build it

```
node build.js
```

That's the whole build — no `npm install` needed, it only uses Node's
built-in `fs`/`path`. Output lands in `dist/`, one folder per page with
clean URLs (`dist/about/index.html` → served at `/about/`).

To preview locally before deploying:

```
npx serve dist
```

(or `python3 -m http.server --directory dist 8080`) — then open the
printed local URL. Don't just double-click `dist/index.html`; the
clean-URL links between pages need an actual server to resolve correctly.

## Deploying to go live

You said you want this fully code-driven rather than pasted into a page
builder — here's the realistic fastest path, plus the more durable one.

### Fastest: Netlify, drag-and-drop (no git required)

1. Run `node build.js` to produce `dist/`.
2. Go to **app.netlify.com/drop** and drag the `dist` folder onto the page.
3. Netlify gives you a live URL immediately (something like
   `random-name-123.netlify.app`) — the site is already publicly live at
   that URL.
4. Create a free Netlify account if you don't have one (needed to keep the
   site and attach your real domain — an anonymous drop expires).
5. In the Netlify site dashboard: **Domain settings → Add a domain** →
   enter `heattransfertech.com`.
6. Point your domain at Netlify (see DNS section below).

Every time you want to update the live site after this: rebuild
(`node build.js`) and drag the new `dist` folder onto the same site in
Netlify again, or switch to the git-based method below so updates deploy
automatically on every push.

### More durable: Netlify + GitHub (auto-deploys on every change)

1. Push this whole folder to a new GitHub repository.
2. In Netlify: **Add new site → Import an existing project → GitHub** →
   select the repo.
3. Netlify reads `netlify.toml` automatically: build command
   `node build.js`, publish directory `dist`. You don't need to type
   anything in.
4. Every `git push` after that rebuilds and redeploys automatically —
   this is the version I'd recommend once the site is past initial launch,
   since it gives you a history of every change and rollback with one click.

### Alternatives to Netlify

Vercel and Cloudflare Pages both work the same way (drag-and-drop or
git-connected, same `node build.js` / `dist` build settings) if you'd
rather use one of those instead — the site has zero Netlify-specific code
except the contact form (see below), which is a one-line swap.

## Pointing heattransfertech.com at the new host

Your domain is currently pointed at Squarespace's placeholder site. To go
live on Netlify (or any other host) instead:

1. **Find out where the domain is registered.** If you bought it *through*
   Squarespace (Squarespace Domains), you manage DNS from Squarespace's
   Domains panel even though the site itself will no longer be on
   Squarespace. If you registered it elsewhere (GoDaddy, Namecheap, etc.)
   and only pointed it at Squarespace, you manage DNS at that registrar.
   Tell me which one it is and I can give exact click-by-click steps.
2. In Netlify's domain settings for this site, it will show you the exact
   DNS records to add — typically an `A` record for the bare domain
   pointing to Netlify's load balancer, and a `CNAME` for `www` pointing to
   your `*.netlify.app` address (or you can delegate nameservers to Netlify
   DNS entirely, which is simpler but hands Netlify full DNS control).
3. DNS changes typically go live within a few hours, sometimes up to 24-48
   hours depending on the registrar's TTL settings.
4. Until step 2 is done, the site is fully live and testable at its
   `*.netlify.app` URL — you don't need to touch DNS to start reviewing it.

## Contact form

The Contact page form is wired for **Netlify Forms** (`data-netlify="true"`
in `src/pages/contact.content.html`) — zero backend code, submissions show
up in the Netlify dashboard and can forward to email. This only works if
you deploy on Netlify.

If you deploy somewhere else (Vercel, Cloudflare Pages, GitHub Pages),
swap the `<form>` tag for a form backend like Formspree (free tier, one
line: `<form action="https://formspree.io/f/YOUR_ID" method="POST">`) —
tell me which host you land on and I'll make that swap.

## Before this site is fully publish-ready

Three pages still contain bracketed placeholders that need real
information before launch — flagged in-page with an orange dashed
"placeholder" style so they're impossible to miss if you preview the site:

1. **About** (`src/pages/about.content.html`) — merger year, combined
   years of experience, why the merger happened, leadership bios.
2. **Contact** (`src/pages/contact.content.html`) — address(es) and phone
   number(s).
3. **Projects** (`src/pages/projects.content.html`) — currently one
   template case study; needs real project content.
4. **Structured data** (`build.js`, the `extraHead` block for the home
   page) — same address/phone placeholders, used by search engines.

Send me the real details whenever you have them and I'll drop them
straight into these files — no other rewriting needed, then re-run
`node build.js` and redeploy.

## No logo / brand colors yet

`assets/css/styles.css` defines the whole palette as CSS variables at the
top of the file (`--navy`, `--steel-blue`, `--safety-orange`, etc.).
Once you have real brand colors, updating those four or five hex values
re-themes the entire site in one edit. The header currently uses a text
logotype ("HT" mark + wordmark) as a placeholder — swap in a real logo
image inside `src/layout.html` (`.logo` block) once you have one.
