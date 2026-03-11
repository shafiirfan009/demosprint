# Demo Sprint — Setup Guide

## Brief Automation v2 (Gmail + Vercel + Supabase)

This repo now includes:
- multipart brief submission API: `POST /api/briefs/submit`
- optional attachments in brief step 5 (max 3 files, 10MB each)
- generated PDF summary saved to Supabase storage
- two emails per brief (internal + lead) via Gmail SMTP
- admin dashboard: `/admin/briefs` with Supabase magic-link auth

### 0. Install dependencies

```bash
npm install
```

### 0.1 Database + storage migration

Run:

```sql
-- in Supabase SQL editor
\i sql/briefs_v2.sql
```

If your SQL editor does not support `\i`, copy-paste the file content from:
- `sql/briefs_v2.sql`

### 0.2 Environment variables (Vercel Project Settings)

Set these variables:

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BRIEF_BUCKET=brief-assets

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=yourgmail@gmail.com
SMTP_APP_PASSWORD=your_google_app_password
MAIL_FROM=yourgmail@gmail.com
INTERNAL_BRIEF_TO=yourgmail@gmail.com

ADMIN_EMAIL_ALLOWLIST=yourgmail@gmail.com
APP_BASE_URL=https://your-vercel-domain.vercel.app
```

### 0.3 Gmail requirements

- Enable 2-step verification for your Google account.
- Create an App Password for Mail and use it as `SMTP_APP_PASSWORD`.
- Sender is `MAIL_FROM` (defaults to `SMTP_USER` if omitted).

### 0.4 Supabase Auth setting for magic link

- In Supabase Auth settings, configure site URL and redirect URL:
  - `https://your-vercel-domain.vercel.app/admin/briefs`

### 0.5 Where to view briefs

- In-app dashboard: `/admin/briefs`
- Raw table: Supabase `public.leads`

---

## 1. Supabase Setup (10 minutes)

### Create your account
1. Go to **supabase.com** → Sign up free (no credit card)
2. Create a new project — name it `demosprint`
3. Choose a strong database password → Save it somewhere safe
4. Wait ~2 minutes for the project to provision

### Create the leads table
Go to **SQL Editor** in your Supabase dashboard and run this:

```sql
create table leads (
  id               bigserial primary key,
  product_name     text,
  product_desc     text,
  end_user         text,
  audience         text,
  desired_action   text,
  output_type      text,
  value_moment     text,
  build_status     text,
  screen_count     text,
  seed_data        text,
  references       text,
  visual_style     text,
  brand_colors     text,
  links            text,
  deadline         text,
  urgency          text,
  client_name      text,
  client_email     text,
  extra_notes      text,
  source_page      text,
  submitted_at     timestamptz default now()
);

-- Allow anonymous inserts (brief form submits without login)
alter table leads enable row level security;

create policy "allow_anon_insert" on leads
  for insert to anon
  with check (true);
```

### Get your API credentials
1. Go to **Project Settings → API**
2. Copy **Project URL** → paste into `js/supabase-client.js` as `SUPABASE_URL`
3. Copy **anon / public** key → paste as `SUPABASE_ANON_KEY`

```js
// js/supabase-client.js — replace these two lines:
const SUPABASE_URL      = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...your-long-key...';
```

### View your leads
Go to **Table Editor → leads** in Supabase dashboard.
Every brief submission appears here as a new row instantly.

---

## 2. Add Demo Content

Each demo page has a placeholder comment block. Replace it with actual demo content:

- `demos/seo/index.html` — paste body content from `seo-demo.html`
- `demos/crm/index.html` — paste body content from your CRM demo
- `demos/brand/index.html` — paste body content from your Brand demo

Remove the `<html>`, `<head>`, `<body>` tags from the pasted content — 
only paste what's BETWEEN the `<body>` tags of the original demo.

Also remove any `<script>` tags from the pasted content that duplicate
the supabase-client.js or brief-modal.js already loaded at the bottom.

---

## 3. Update Demo Links in Landing Page

In `index.html`, find the three `product-demo-link` anchors and update the `href` values:

```html
<!-- SEO Demo -->
<a href="https://YOUR-VERCEL-URL/demos/seo" ...>View live demo</a>

<!-- Brand Demo -->
<a href="https://YOUR-VERCEL-URL/demos/brand" ...>View live demo</a>

<!-- CRM Demo -->
<a href="https://YOUR-VERCEL-URL/demos/crm" ...>View live demo</a>
```

Once everything is under one Vercel project, replace with relative paths:
```html
<a href="/demos/seo" ...>View live demo</a>
```

---

## 4. GitHub Setup

```bash
# In your terminal:
git init
git add .
git commit -m "Initial Demo Sprint project"

# Create a new repo on github.com named 'demosprint'
# Then:
git remote add origin https://github.com/YOUR-USERNAME/demosprint.git
git branch -M main
git push -u origin main
```

---

## 5. Vercel Deployment

1. Go to **vercel.com** → New Project
2. Click **Import Git Repository** → connect GitHub → select `demosprint`
3. Framework Preset: **Other**
4. Root Directory: leave as `/`
5. Click **Deploy**

Your site is live at `demosprint.vercel.app`

### Rename the project
Vercel Dashboard → Project → Settings → General → Project Name → type `demosprint` → Save

### Auto-deploys
Every `git push` to `main` automatically redeploys. That's why GitHub is better than drag-drop.

---

## 6. Project Structure

```
demosprint/
├── index.html              ← landing page (all CTAs open brief modal)
├── vercel.json             ← clean URL routing
├── css/
│   └── shared.css          ← shared nav, watermark, modal styles
├── js/
│   ├── supabase-client.js  ← Supabase config + submit function
│   └── brief-modal.js      ← full 6-step brief form modal
└── demos/
    ├── seo/index.html      ← SEO diagnostic demo
    ├── crm/index.html      ← CRM dashboard demo
    └── brand/index.html    ← Brand exploration demo
```

---

## 7. Your Final Live URLs

Once deployed as `demosprint` on Vercel:

| Page | URL |
|---|---|
| Landing page | `demosprint.vercel.app` |
| SEO Demo | `demosprint.vercel.app/demos/seo` |
| CRM Demo | `demosprint.vercel.app/demos/crm` |
| Brand Demo | `demosprint.vercel.app/demos/brand` |

---

## 8. GitHub on Landing Page?

Recommendation: **No** on the landing page. Your clients are founders, not devs.
Add it only on LinkedIn under Contact Info and in the demo page footers.

---

## Questions / Issues

Every brief submission is logged to Supabase even if there's a network error
(the modal shows success regardless — never block UX on a backend error).
Check the Supabase Table Editor regularly for new leads.
