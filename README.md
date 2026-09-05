# BANDOLF Developer Documentation

The official developer documentation site for [BANDOLF](https://bandolf.com) — a React SPA that renders Markdown content with search, navigation, and API reference layouts.

**Live site:** [docs.bandolf.com](https://docs.bandolf.com)

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** for styling
- **React Router** for client-side routing
- **react-markdown** with GFM, callouts, tabs, and Shiki syntax highlighting
- **Fuse.js** for full-text search
- Markdown files in `content/` with YAML frontmatter

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install & run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` and redirects `/` to `/docs`.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npm run generate:content` | Regenerate placeholder Markdown files |

## Project Structure

```
content/              Markdown documentation pages
public/bandolf/       Brand assets (logos)
scripts/              Content generation utilities
src/
  components/         UI, layout, markdown, search
  hooks/              Theme, search modal, page meta
  lib/                Markdown registry, search, frontmatter parsing
  pages/              Route-level page components
.github/workflows/    CI (build) and CD (deploy placeholder)
```

## Adding Documentation

Navigation is generated automatically from Markdown frontmatter. To add a new page:

1. Create a `.md` file under `content/`
2. Add frontmatter with at least `title`, `category`, and `slug`
3. Write the page content in Markdown

Example:

```md
---
title: Quickstart
description: Get started with BANDOLF in minutes.
category: Getting Started
slug: /docs/quickstart
order: 2
---

# Quickstart

Your content here.
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title shown in the sidebar and browser tab |
| `category` | Yes | Sidebar section name |
| `slug` | Yes | Route path (e.g. `/docs/quickstart`) |
| `description` | No | Short summary used in search and meta tags |
| `order` | No | Sort order within a category |
| `featured` | No | Highlight on the docs landing page |
| `sidebar` | No | Set to `false` to hide from the sidebar |
| `type` | No | Set to `api` for API reference layout |
| `method` | No | HTTP method badge for API pages |
| `endpoint` | No | API endpoint path for API pages |

No manual navigation config is required — the sidebar, breadcrumbs, prev/next links, and search index update automatically.

## Features

- **GitBook-style sidebar** with collapsible sections
- **Dark / light theme** toggle with system preference detection
- **Full-text search** across titles, descriptions, categories, and page content
- **Table of contents** for in-page headings
- **API doc layout** with method badges and environment switcher
- **Edit on GitHub** links on every documentation page
- **Turkish UI** with English-ready content structure

## CI / CD

- **`ci.yml`** — Runs on push and pull requests: `npm ci` + `npm run build` on Ubuntu
- **`cd.yml`** — Triggered only after a successful CI run on push (deploy placeholder for now)

## Contributing

Documentation source lives in the [`bandolfcom/documents`](https://github.com/bandolfcom/documents) repository under `content/`. Use the **Edit this page** link at the bottom of any doc page, or open a pull request with your changes.

## License

Proprietary — BANDOLF. All rights reserved.
