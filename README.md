# HTT website — my notes

One file: `index.html`. No build step, no dependencies, nothing to install.
Styles, scripts, the logo, every page — all of it lives in that one file.
Open it in a browser and the whole site works, navigation included.

## How it's put together

Single-page app. Every "page" is a `<div class="page" id="p-...">` inside
that one file, and navigation just swaps which one is visible using URL
hashes (`#/about`, `#/equipment/cooling-towers`). 55 routes:

- 31 equipment pages: 10 categories, 20 sub-pages under the six categories
  that have them, plus the index. Three levels deep, e.g.
  `#/equipment/heat-exchangers/plate-frame`
- Markets Served, two levels deep — five top-level categories, with
  Industrial Cooling and Comfort Cooling fanning out to sub-pages
- Heat transfer equations reference with a 14-row unit converter
- Heat load calculator — solves for any variable, outputs data only,
  validates against physical limits and nothing else
- Geographic US territory map on Contact Us
- Emergency parts page with ZIP-to-territory lookup

## Is the new version actually live?

Footer, bottom right, small grey type next to the copyright: `b.2026-08-25.2`.
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

Drag this folder onto `app.netlify.com/drop` for an instant URL, or connect
the GitHub repo for auto-deploys. No build command. Publish directory is the
repo root.

### Anywhere else

Plain static HTML. Vercel, Cloudflare Pages, S3, any host at all. Upload
`index.html`.

## Before this goes live — my punch list

Everything below shows an orange **TODO** box on the site, so I can't miss
them while previewing.

1. **Contact info** — address, city/state/ZIP, main phone, email, hours.
   Shows on Contact Us and in the footer.
2. **Company history** — About page has an "Our history" section written
   deliberately vague. Need to decide how both legacy names get presented
   publicly, founding and merger dates, years in business for each, who
   carried over, whether either name stays in use.
3. **Territory assignments** — the map is my working guess at four regions
   with my name as rep on all four. Needs real boundaries and real reps. One
   editable list near the top of the `<script>`; search `TERRITORIES` and
   `STATES`.
4. **Emergency parts contacts** — phone and email per territory. Decide
   whether to say 24/7.
5. **ZIP-to-territory boundaries** — currently public USPS prefix ranges as
   an approximation, not our confirmed coverage.
6. **Leadership bios** — one sample entry using my name as a format test.
7. **Contact form** — dead. Wire it to Formspree, Netlify Forms, or Basin.
   Netlify Forms is free if I host there.
8. **Supplier and manufacturer names** — one orange box per equipment
   category, ten in total, in the "Lifecycle support" section near the bottom
   of each. Sub-pages deliberately have none.
9. **Sanitary certifications** — 3-A, NSF or equivalent for Food & Process,
   once I've checked which lines carry them.

## Tradeoff I already decided on

Every page is one file with JavaScript swapping sections, so search engines
and link-preview scrapers only ever see the Home page's `<title>` and meta
description. No per-page SEO metadata.

For a site where most traffic comes by referral, word of mouth, and the domain
itself, that's worth it for the depth and interactivity. If organic search for
specific equipment or market terms ever becomes a priority, this is the first
thing to revisit — either real URLs with server-rendered metadata, or a few
lightweight static landing pages that link into the app.

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
- **Equipment structure** — three places to touch when a category changes:
  `ROUTES` at the top of the script, the `#g-equipment` list in the sidebar,
  and the 10-card grid, which appears twice (Home and the Equipment index)
  with identical markup. Sidebar highlighting picks the longest matching
  ancestor, so a sub-page lights up its parent link without extra wiring.
