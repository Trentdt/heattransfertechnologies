# HTT website — my notes

One file: `index.html`. No build step, no dependencies, nothing to install.
Styles, scripts, the logo, the photos, and every page live in that one file. Open it in a browser and the whole site works,
navigation included.

**Direction (Oct 2026): aftermarket only.** The site sells replacement parts,
inspections and assessments, and cooling tower component replacement. We do
not sell new equipment. Keep new-equipment language (sizing, selection,
"we supply towers", and so on) off the site.

## How it's put together

Single-page app. Every "page" is a `<div class="page" id="p-...">` inside
that one file, and navigation just swaps which one is visible using URL
hashes (`#/about`, `#/parts/cooling-towers`). 37 pages:

- Services: `#/service` index, plus Inspections & Assessments, Tower
  Component Replacement, Service Agreements, and Emergency Parts
- Parts: `#/parts` index plus 9 equipment types (cooling towers, closed
  circuit and fluid coolers, ACHE, heat exchangers, chillers, direct steam
  injection, filtration, pumps, controls). Page ids are still `p-eq-*`.
- Old `#/equipment/...` and `#/parts-service` links redirect to the new pages
  (`REDIRECTS` near the top of the script). The 20 equipment sub-pages and
  Rental Equipment were removed in the aftermarket rebuild.
- Photo Credits (`#/credits`), which is required by the photo licenses. Keep it.
- Privacy Policy (`#/privacy`), Terms of Use (`#/terms`), Accessibility
  (`#/accessibility`), linked from the footer. Drafts: fill the TODOs and have
  counsel review before launch.
- Find Your Representative (`#/representative`): territory map, request form,
  company info. Replaced Contact Us. The About page was removed (Oct 2026).
  `#/contact` and `#/about` redirect.

**Copy style:** short, plain, technical. Lists over paragraphs. No slogans,
no rhetorical questions, no "X, not Y" lines.
- Markets Served, two levels deep — five top-level categories, with
  Industrial Cooling and Comfort Cooling fanning out to sub-pages
- Heat transfer equations reference with a 14-row unit converter
- Heat load calculator — solves for any variable, outputs data only,
  validates against physical limits and nothing else
- Geographic US territory map on Contact Us
- Emergency parts page with ZIP-to-territory lookup

## Is the new version actually live?

Footer, bottom right, small grey type next to the copyright: `b.2026-10-27.1`.
If the live site shows that, I'm current. Older stamp or nothing at all means
the deploy didn't take.

## Previewing

Double-click `index.html`. Hash routing means it runs straight off local disk,
no server needed.

To test it the way a host serves it: `python3 -m http.server 8080` from this
folder, then open the printed URL.

## Deploying

### GitHub Pages

**Settings → Pages → Source → "Deploy from a branch" → main → `/ (root)`.**

This one matters. If Source is on "GitHub Actions" instead, pushing files does
nothing — Pages only updates when a workflow runs and uploads the site as an
artifact, so uploads just sit in the repo and never go live. That already cost
me a round of confusion. There's no build step here, so a workflow has nothing
to do anyway.

`index.html` has to be at the repo root, not in a subfolder.

Pages sits behind a CDN. Hard-refresh (Ctrl+Shift+R) after deploying before
deciding something is broken.

### Netlify

The repo is connected to Netlify, so every commit auto-deploys. No build
command. Publish directory is the repo root.

Uploading through the GitHub website: Add file → Upload files, drag in
`index.html`, commit. Filenames must match exactly
(`index.html`, not `index 3.html`).

### Anywhere else

Plain static HTML. Vercel, Cloudflare Pages, S3, any host at all. Upload
`index.html`.

## Before this goes live — my punch list

Everything below shows an orange **TODO** box on the site, so I can't miss
them while previewing.

1. **Contact info** — address, city/state/ZIP, main phone, email, hours.
   Shows on Find Your Representative and in the footer.
2. **Territory assignments** — the map is my working guess at four regions
   with my name as rep on all four. Needs real boundaries and real reps. One
   editable list near the top of the `<script>`; search `TERRITORIES` and
   `STATES`.
3. **Emergency parts contacts** — phone and email per territory. Decide
   whether to say 24/7.
4. **ZIP-to-territory boundaries** — currently public USPS prefix ranges as
   an approximation, not our confirmed coverage.
5. **Contact form** — dead. Wire it to Formspree, Netlify Forms, or Basin.
   Netlify Forms is free if I host there.
6. **Parts lines** — one orange box per parts page (nine), naming the parts
   lines we carry once display rights are confirmed. Chillers also needs the
   parts scope confirmed.
7. **Sanitary materials** — 3-A, NSF, FDA-compliant or equivalent for Food &
   Process, once I've checked which parts lines carry them.
8. **Inspection scope** — what we inspect per equipment type, whether thermal
    testing follows CTI ATC-105, and a sample report if we can share one.
9. **Service agreement tiers** — response times, visits included, coverage.
10. **Our own job photos** — before and after shots from our own tower jobs,
    with permission. Better than any stock photo.

13. **Legal entity details** — full legal name (LLC/Inc.), state, mailing
    address, privacy contact email, and the governing-law state in the Terms.
    Use the full legal name in the footer copyright too. Counsel review.
14. **Make the GitHub repo private.** It's public now, so anyone can read this
    README and the site source on GitHub. Netlify works fine with a private
    repo. (`_redirects` already keeps `/README.md` off the live site.)
15. **Sharing image** — a 1200x630 `og-image.jpg` at the repo root plus an
    `og:image` tag, so links shared in email/Teams/LinkedIn show a picture.
16. **Self-host the fonts** (optional) — removes the only third-party request
    (Google Fonts) and the Google mention in the Privacy Policy.

17. **Coverage is the contiguous United States** (Oct 2026). Site text is
    updated. The territory map, `TERRITORIES`/`STATES`, and the ZIP lookup still
    reflect the old eastern territories; redo them once territory lines are set.
18. **Photos to supply** — home page is photo-free on purpose until these
    arrive: a strong hero image, a BAC Series 3000 for Tower Component
    Replacement (ours, or BAC-approved for our use), and an inspection photo.
    No free-license source had a usable S3000 or inspection shot.

## Netlify files

- `_headers` — security headers (Content-Security-Policy and friends). If the
  form is wired to Formspree or similar, add that domain to `form-action` and
  `connect-src` or the form will be blocked.
- `_redirects` — keeps `README.md` and the old `images/` folder off the live
  site.

## Tradeoff I already decided on

Every page is one file with JavaScript swapping sections, so search engines
and link-preview scrapers only ever see the Home page's `<title>` and meta
description. No per-page SEO metadata.

For a site where most traffic comes by referral, word of mouth, and the domain
itself, that's worth it for the depth and interactivity. If organic search for
specific equipment or market terms ever becomes a priority, this is the first
thing to revisit — either real URLs with server-rendered metadata, or a few
lightweight static landing pages that link into the app.

## Photos

Embedded in `index.html` as data in the CSS (`.ph-<name>` classes, one per
photo, defined once near the end of the second `<style>` block). They were
in an `images/` folder, but that depends on the folder making it into the
repo, so they live in the file now. Photos are WebP, about 900px wide, and the photo CSS sits at the end of the
page so text renders first. Total page is about 1.4 MB. If weight becomes a
problem, move photos back to real files. Real photographs from Wikimedia Commons
and the Library of Congress, each public domain, CC0, or CC BY-SA. No AI
images, and none with a cooling tower maker's logo showing. License details
for every photo are on the Photo Credits page (`PHOTOS` data is baked into
that page). The CC BY-SA photos also carry a short credit line under the
photo. If you add a photo, add it to the credits page too, and don't use
anything without a clear license.

## Where things are

All inline in `index.html`:

- **Page copy** — search the heading text, or the `id="p-..."` wrapper.
- **Colors and branding** — CSS custom properties at the top of `<style>`
  (`--navy`, `--red`, and so on).
- **Data behind the tools** — converter rows, fluid properties including
  glycol freeze points, equipment field definitions, territories, state
  assignments, ZIP ranges. One labeled config block near the top of
  `<script>`, commented section by section.
- **Calculator** — to make a new variable solvable, mark its field `f.sv()`
  in `EQUIPMENT` and add the closed-form inverse to `solve()`. Derived
  readouts use `f.der()` and compute in `derive()`. Validation lives in
  `solve()` and covers physical limits only: leaving temperature below the
  ambient wet or dry bulb, streams that cross, a fluid below its freeze
  point. No opinions about typical ranges — that was deliberate.
- **Territory map** — real SVG geography from US Census boundary data under
  an Albers projection. Label positions are computed, not typed. Don't nudge
  them by eye; that's how CA ended up jammed against NV.
- **Parts structure** — three places to touch when a parts category changes:
  `ROUTES` at the top of the script, the `#g-equipment` list in the sidebar
  (now labeled Parts), and the 9-card grid, which appears twice (Home and
  the Parts index) with identical markup.
- **Sidebar** — nests three levels, and every page on the site has its own
  link in it. A group opens when the current page is one of its descendants,
  and that is worked out from the links themselves rather than from the URL.
  That's the only way `/markets/power` opens under Industrial Cooling, since
  it doesn't share that path. The current item scrolls itself into view on
  navigation, because the tree is now taller than a short laptop screen.
