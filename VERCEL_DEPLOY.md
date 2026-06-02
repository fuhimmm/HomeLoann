# HomeLoan Score - Vercel Deployment Guide

## Project Overview
**HomeLoan Score** adalah aplikasi web untuk penilaian kelayakan kredit properti (KPR) menggunakan sistem analisis **5C** (Character, Capacity, Capital, Collateral, Condition).

- **Framework**: Next.js 16.2.6
- **Package Manager**: pnpm
- **Language**: TypeScript + React 19

## Prerequisites
Sebelum deploy ke Vercel, pastikan:
- [x] Akun Vercel aktif (https://vercel.com)
- [x] Git repository siap (GitHub/GitLab/Bitbucket)
- [x] Node.js 18+ terinstall (untuk local development)

## How to Deploy

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel account
vercel login

# Deploy from project root
vercel

# Follow the interactive prompts:
# - Confirm project name
# - Confirm root directory (.)
# - Skip build overrides
# - Skip env vars (none required for this project)
```

### Option 2: Using GitHub Integration (Recommended for Teams)
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/home-loan-score-kpr.git
   git push -u origin main
   ```

2. Connect to Vercel:
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js and use optimal settings
   - Click "Deploy"

### Option 3: Drag & Drop (Quick Preview)
1. Run local build:
   ```bash
   pnpm install
   pnpm build
   ```
2. Go to https://vercel.com/new
3. Drag the `.next` folder to Vercel
4. Deploy (preview only, not recommended for production)

## Build Configuration
Project sudah dikonfigurasi dengan:
- ✅ `vercel.json` dengan custom build command
- ✅ `next.config.mjs` dioptimalkan untuk Vercel
- ✅ `pnpm-lock.yaml` untuk consistency
- ✅ Environment variables support (jika dibutuhkan di masa depan)

## Local Development
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server locally
pnpm start
```

## Deployment Checklist
- [x] Project builds successfully (`pnpm build`)
- [x] No TypeScript errors
- [x] No console warnings in build
- [x] `.next/` folder is in `.gitignore`
- [x] `node_modules/` is in `.gitignore`
- [x] `vercel.json` configured
- [x] All dependencies in `package.json`

## Post-Deployment
Setelah deployment berhasil:
1. **Verify**: Kunjungi URL yang diberikan Vercel
2. **Custom Domain** (optional):
   - Dashboard Vercel → Project Settings → Domains
   - Add your custom domain
3. **Environment Variables** (jika dibutuhkan):
   - Dashboard Vercel → Project Settings → Environment Variables
4. **Analytics** (optional):
   - Vercel Analytics sudah enabled via `@vercel/analytics`

## Features
- 📋 Form input lengkap untuk data identitas, pekerjaan, keuangan
- 📊 Sistem penilaian 5C otomatis
- 🔢 Kalkulasi metrik finansial real-time (DBR, DSR, LTV, DER)
- 📈 Simulasi KPR dengan perhitungan cicilan
- ✅ Scoring decision (Approved/Considered/Risky/Rejected)
- 📱 Responsive design dengan Tailwind CSS
- 🎨 Shadcn UI components

## Troubleshooting

### Build Error: "Too many re-renders"
✅ **FIXED**: Changed `useMemo` to `useEffect` in page.tsx for DSR/LTV auto-update

### Environment Variables
This project doesn't require environment variables. If you add them in the future:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add your variables
3. Redeploy

### Build Takes Too Long
- Check `.gitignore` includes `node_modules/`
- Verify `pnpm-lock.yaml` is committed
- Consider using Vercel's build cache

## Support
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs
- v0.app: https://v0.app

---
**Created**: May 19, 2026  
**Project Status**: ✅ Ready for Production Deployment
