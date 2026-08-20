#!/usr/bin/env node
/**
 * Zero-dependency static site builder for the Heat Transfer Technologies
 * website. Reads src/layout.html + one content partial per page, injects
 * SEO metadata, sets the active nav link, and writes clean-URL output to
 * dist/ (e.g. dist/about/index.html -> served at /about/).
 *
 * Usage: node build.js
 * No npm install required — uses only Node's built-in fs/path modules.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

const SITE_URL = "https://www.heattransfertech.com";

// BASE_PATH lets the exact same source build for two different situations:
//  - production on the real domain, served from "/" (BASE_PATH = "")
//  - a GitHub Pages *project* preview, served from "/<repo-name>/"
//    (BASE_PATH = "/<repo-name>", passed in via the SITE_BASE env var by
//    .github/workflows/pages.yml — see that file for where it comes from)
// Every internal absolute link/asset path (anything starting href="/ or
// src="/) gets this prefixed on. Production leaves it empty, so nothing
// changes for the real deploy.
const BASE_PATH = (process.env.SITE_BASE || "").replace(/\/$/, "");

// One entry per page. `path` is the clean URL path (with trailing slash).
// `nav` matches a data-nav value in layout.html for active-state styling.
const PAGES = [
  {
    slug: "home",
    urlPath: "/",
    nav: "home",
    title: "Heat Transfer Technologies | Industrial Cooling Equipment & Service",
    description: "Heat Transfer Technologies supplies and services cooling towers, heat exchangers, and chillers for Power, Steel, Oil & Gas, and Process industries across the Eastern US.",
    extraHead: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Heat Transfer Technologies",
  "url": "${SITE_URL}",
  "logo": "${SITE_URL}/assets/favicon.svg",
  "description": "Heat Transfer Technologies supplies, designs around, and services industrial cooling and heat transfer equipment for Power, Steel, Oil & Gas, Process, Hydrogen, and Carbon Capture markets across the Eastern US.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[STREET ADDRESS]",
    "addressLocality": "[CITY]",
    "addressRegion": "PA",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "telephone": "[MAIN PHONE NUMBER]",
  "email": "info@heattransfertech.com",
  "areaServed": "Eastern United States"
}
</script>`,
  },
  {
    slug: "equipment",
    urlPath: "/equipment/",
    nav: "equipment",
    title: "Industrial Cooling Equipment | Towers, Exchangers, Chillers",
    description: "Explore Heat Transfer Technologies' full equipment line: cooling towers, closed loop coolers, air-cooled heat exchangers, chillers, filtration, pumps and controls.",
  },
  {
    slug: "markets",
    urlPath: "/markets/",
    nav: "markets",
    title: "Markets We Serve | Power, Steel, Oil & Gas, Process, Hydrogen",
    description: "Heat Transfer Technologies supports Power, Steel, Oil & Gas, Process, Hydrogen, and Carbon Capture facilities with engineered cooling equipment and lifecycle support.",
  },
  {
    slug: "parts-service",
    urlPath: "/parts-service/",
    nav: "parts",
    title: "Parts & Service | Cooling Equipment Repair & Maintenance",
    description: "Repair, maintenance contracts, and performance evaluations for cooling towers, heat exchangers, and chillers.",
  },
  {
    slug: "projects",
    urlPath: "/projects/",
    nav: "projects",
    title: "Project Case Studies | Heat Transfer Technologies",
    description: "See how Heat Transfer Technologies has solved cooling and heat transfer challenges for Power, Steel, Process, and Oil & Gas facilities.",
  },
  {
    slug: "about",
    urlPath: "/about/",
    nav: "about",
    title: "About Heat Transfer Technologies | Our History & Team",
    description: "Heat Transfer Technologies unites two established heat transfer equipment firms into one full-lifecycle cooling solutions provider.",
  },
  {
    slug: "contact",
    urlPath: "/contact/",
    nav: "contact",
    title: "Contact Us | Request a Quote — Heat Transfer Technologies",
    description: "Get in touch with Heat Transfer Technologies for equipment quotes, parts, service, or engineering support.",
  },
  {
    slug: "404",
    urlPath: "/404.html", // special: not clean-URL, served directly by most hosts
    nav: "",
    title: "Page Not Found | Heat Transfer Technologies",
    description: "The page you're looking for doesn't exist or has moved.",
  },
];

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

function build() {
  const layout = readFile(path.join(SRC, "layout.html"));

  // Reset dist/
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const page of PAGES) {
    const contentPath = path.join(SRC, "pages", `${page.slug}.content.html`);
    const content = readFile(contentPath);

    let html = layout
      .replace(/{{TITLE}}/g, escapeAttr(page.title))
      .replace(/{{DESCRIPTION}}/g, escapeAttr(page.description))
      .replace(/{{CANONICAL_PATH}}/g, page.urlPath)
      .replace(/{{EXTRA_HEAD}}/g, page.extraHead || "")
      .replace("{{CONTENT}}", content);

    // Mark the active nav link (desktop + mobile) by matching data-nav.
    if (page.nav) {
      const re = new RegExp(`(data-nav="${page.nav}")`, "g");
      html = html.replace(re, `$1 class="active" aria-current="page"`);
    }

    // Prefix every internal absolute link/asset path with BASE_PATH.
    // A no-op when BASE_PATH is "" (production). Only touches href="/..."
    // and src="/..." — external links (https://...), mailto:, tel:, and
    // in-page "#anchor" links never start with a bare "/" so they're
    // untouched.
    if (BASE_PATH) {
      html = html.replace(/(href|src)="\//g, `$1="${BASE_PATH}/`);
    }

    // Determine output file path
    let outFile;
    if (page.urlPath.endsWith(".html")) {
      outFile = path.join(DIST, page.urlPath.replace(/^\//, ""));
    } else {
      const dir = path.join(DIST, page.urlPath.replace(/^\//, ""));
      fs.mkdirSync(dir, { recursive: true });
      outFile = path.join(dir, "index.html");
    }
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, "utf8");
    console.log("built:", page.urlPath);
  }

  // Copy static assets as-is
  copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));

  // Copy static files that must live inside the published output
  // (netlify.toml intentionally excluded — Netlify reads it from the repo
  // root during git-based builds, not from the publish directory).
  for (const file of ["robots.txt", "sitemap.xml", "_redirects"]) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
      console.log("copied:", file);
    }
  }

  console.log("\nBuild complete ->", DIST);
  if (BASE_PATH) console.log(`(built with BASE_PATH="${BASE_PATH}" for a subpath deploy, e.g. GitHub Pages)`);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

build();
