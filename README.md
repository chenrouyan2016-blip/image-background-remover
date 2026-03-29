# Image Background Remover

AI-powered image background removal tool built with Next.js and Remove.bg API.

## Features

- 🖼️ Drag & drop or click to upload (JPG, PNG, WEBP, max 10MB)
- ⚡ Instant background removal via Remove.bg API
- 🔍 Side-by-side original vs result comparison
- ⬇️ Download result as PNG (transparent background)
- 🔒 No image storage — processed entirely in memory

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI**: [Remove.bg API](https://www.remove.bg/api)
- **Deploy**: Vercel

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your API key:

```bash
cp .env.example .env.local
```

Get your free API key at [remove.bg/api](https://www.remove.bg/api) (50 free calls/month).

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set `REMOVE_BG_API_KEY` as an environment variable in your Vercel project settings.

## Project Structure

```
app/
├── api/
│   └── remove-bg/
│       └── route.ts      # Backend API — forwards to Remove.bg
├── pricing/
│   └── page.tsx          # Pricing page
├── layout.tsx            # Root layout with nav & footer
├── page.tsx              # Home page with upload & result UI
└── globals.css           # Global styles
```

## License

MIT
