# Heat Transfer Technologies — website source

One file: `index.html`. No build step, no dependencies, nothing to install.
Styles, scripts, the logo, and every page live inside it. Open it in a
browser and the whole site works, including navigation.

## How it's put together

It's a single-page app. Every "page" is a `<div class="page" id="p-...">`
in that one file, and navigation swaps which one is visible using URL
hashes (`#/about`, `#/equipment/cooling-towers`). 35 routes in total:

- 10 equipment categories, each with its own page
- Markets Served, two levels deep — five top-level categories, with
  Industrial Cooling and Comfort Cooling each fanning out to sub-pages
- A heat transfer equations reference with a 14-row unit converter
- A heat load calculator that solves for any variable in the governing
  relationship and reports the result as data, with validation against
  physical limits only
- A geographic US territory map on the Contact page
- An emergency parts page with ZIP-to-territory lookup

## Checking which version is live

The footer carries a build stamp in small grey type on the right, next to
the copyright: `b.2026-08-24.6`. If the live site shows that, it's current.
If it shows an older stamp or nothing at all, the deploy didn't take.

## Previewing

Double-click `index.html`. That's it — hash routing means it works straight
off local disk with no server.

If you want to test it the way a host will serve it: `python3 -m http.server 8080`
from this folder, then open the printed URL.

## Deploying

### GitHub Pages

**Settings → Pages → Source → "Deploy from a branch" → main → `/ (root)`.**

That setting matters. If Source is set to "GitHub Actions" instead, pushing
files does nothing on its own — Pages only updates when a workflow runs and
uploads the site as an artifact, so your uploads sit in the repo and never
go live. This site has no build step, so there's nothing for a workflow to
do anyway.

`index.html` has to be at the repo root, not in a subfolder.

Pages sits behind a CDN, so hard-refresh (Ctrl+Shift+R) after a deploy
before concluding something didn't work.

### Netlify

Drag this folder onto `app.netlify.com/drop` for an instant URL, or connect
the GitHub repo for auto-deploys. No build command. Publish directory is
the repo root.

### Anywhere else

Plain static HTML. Any host works — Vercel, Cloudflare Pages, S3, a shared
host from 2004. Upload `index.html`.

## What still needs real information

Several places show an orange-flagged **[PLACEHOLDER]** instead of invented
facts. They're impossible to miss when previewing. Send the real details and
they drop straight in:

1. **Contact information** — address, city/state/ZIP, main phone, email,
   hours. Appears on the Contact page and in the footer.
2. **Company history** — the About page has an "Our history" section with
   deliberately generic copy. It needs the legacy company names as you want
   them presented publicly, founding and merger dates, years in business for
   each, leadership continuity, and whether either name is being retained.
3. **Territory assignments** — the coverage map has a working *guess* at
   four regions with your name as placeholder rep on all four. Real
   boundaries and real rep contact details are needed. All of it lives in
   one editable list near the top of the `<script>` block; search for
   `TERRITORIES` and `STATES`.
4. **Emergency parts contacts** — phone and email per territory, and whether
   the line runs 24/7.
5. **ZIP-to-territory boundaries** — the lookup currently uses public USPS
   ZIP-prefix ranges as an approximation, not your confirmed coverage areas.
6. **Leadership bios** — the About page has one sample entry using your name.
7. **Contact form backend** — the form is UI-only and says so on the page.
   Netlify Forms is free and simplest if you deploy there; Formspree works
   anywhere.
8. **Supplier and manufacturer names** — several equipment pages note where
   naming lines you have rights to display would strengthen the page.
9. **Sanitary certifications** — 3-A, NSF, or similar, for the Food & Process
   page, once confirmed.

## One tradeoff worth knowing about

Because every page is one file with JavaScript swapping sections, search
engines and link-preview scrapers only ever see the Home page's `<title>`
and meta description. There's no per-page SEO metadata.

For a small industrial B2B site where most traffic arrives by referral, word
of mouth, and the domain itself, that's a reasonable trade for the depth and
interactivity you get. If organic search for specific equipment or market
terms becomes a priority later, this is the first thing to revisit — either
by moving to real URLs with server-rendered metadata, or by generating a few
lightweight static landing pages that link into the app.

## Editing

Everything is inline in `index.html`:

- **Page copy** — search for the heading text, or for the `id="p-..."`
  wrapper of the page you want.
- **Colors and branding** — CSS custom properties at the top of the
  `<style>` block (`--navy`, `--red`, and so on).
- **Data behind the tools** — converter rows, fluid properties (including
  glycol freeze points), equipment field definitions, territories, state
  assignments, ZIP ranges. All of it sits in one labeled configuration block
  near the top of the `<script>`, with comments explaining each section.
- **Calculator behavior** — to make a new variable solvable, mark its field
  `f.sv()` in `EQUIPMENT` and add the closed-form inverse to `solve()`.
  Derived readouts use `f.der()` and compute in `derive()`. Input validation
  lives in `solve()` and covers physical limits only: a leaving temperature
  below the ambient wet or dry bulb, streams that cross, a fluid asked to run
  below its freeze point.
- **The territory map** — real SVG geography generated from US Census
  boundary data under an Albers projection, with label positions computed
  rather than hand-placed. Don't hand-adjust label coordinates; that's what
  caused labels to crowd state borders previously.
