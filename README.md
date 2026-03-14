# Flowboard

Visual content boards for creators. Build a curated, card-based publication from one page.

## Stack

- **Framework**: Next.js (Pages Router) + TypeScript
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Drag & Drop**: dnd-kit
- **Payments**: Stripe (Phase 2)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

You'll need:
- **Clerk**: Get keys from [clerk.com](https://clerk.com) → your app → API Keys
- **Supabase**: Get keys from [supabase.com](https://supabase.com) → your project → Settings → API

### 3. Set up the database

Go to your Supabase project → SQL Editor → paste the contents of `supabase/migration.sql` and run it.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── sign-in/               # Clerk sign-in
│   ├── sign-up/               # Clerk sign-up
│   ├── dashboard/
│   │   ├── index.tsx           # Board list
│   │   └── [boardId].tsx       # Board editor
│   ├── [slug].tsx              # Public board view
│   └── api/
│       ├── boards/             # Board CRUD
│       ├── cards/              # Card CRUD + reorder
│       └── public/             # Public endpoints (no auth)
├── components/
│   ├── layout/                 # DashboardLayout
│   ├── board/                  # BoardCard, CreateBoardModal
│   ├── cards/                  # ContentCard, CardEditorModal
│   └── ui/                     # Modal
├── lib/
│   └── supabase.ts             # Supabase clients
├── types/
│   └── index.ts                # TypeScript types
└── styles/
    └── globals.css             # Tailwind + custom styles
```

## What's included (MVP)

- Clerk auth (sign up/in/out)
- Create, edit, delete boards
- Add cards: article, short, quote, link, image
- Drag-and-drop card reordering
- Free/premium tagging per card
- Board settings (title, slug, accent color, layout)
- Publish/unpublish toggle
- Public board view at `/your-slug`
- "Powered by Flowboard" footer

## Phase 2 (coming)

- Stripe subscription integration
- Subscriber management
- Content gating (premium unlock)
- Custom domains
- Image uploads (Supabase Storage)
