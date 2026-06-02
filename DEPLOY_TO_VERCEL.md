# 🚀 Deploy HomeLoan Score ke Vercel

Proyek **HomeLoan Score** Anda sudah siap untuk di-deploy ke Vercel! Follow langkah berikut untuk go live dalam hitungan menit.

## Status Proyek ✅
- ✅ Build berhasil tanpa error
- ✅ Semua dependencies terinstall
- ✅ Production-ready
- ✅ Infinite loop bug sudah diperbaiki

## Cara Deploy (Pilih Salah Satu)

### 🟢 CARA 1: Vercel CLI (Tercepat - 2 Menit)

Jika sudah punya akun Vercel, jalankan di terminal:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login ke akun Vercel
vercel login

# 3. Deploy dari folder proyek ini
vercel
```

Selesai! Vercel akan:
- Auto-detect Next.js
- Menggunakan setting optimal
- Build otomatis
- Memberikan live URL

---

### 🔵 CARA 2: GitHub Integration (Recommended untuk Teams)

Lebih powerful dan dapat continuous deployment:

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/home-loan-score.git
   git push -u origin main
   ```

2. **Connect ke Vercel:**
   - Buka https://vercel.com/dashboard
   - Klik "Add New" → "Project"
   - Pilih repository GitHub Anda
   - Klik "Deploy"

**Bonus:** Setiap kali push ke GitHub, Vercel auto-deploy otomatis! 🎉

---

### 🟠 CARA 3: Web UI (Paling Mudah)

1. Buka https://vercel.com/new
2. Login dengan akun Vercel
3. Pilih GitHub/GitLab/Bitbucket
4. Authorize Vercel
5. Pilih repository
6. Klik "Deploy"

---

## Apa Yang Terjadi Saat Deploy?

```
1. Vercel menerima kode Anda
   ↓
2. Install dependencies (pnpm)
   ↓
3. Build proyek (next build)
   ↓
4. Jalankan di production server
   ↓
5. Dapatkan live URL ✨
```

**Durasi:** ~2-3 menit

---

## Hasil Deploy

Setelah sukses, Anda akan mendapat:
- ✅ Live URL (contoh: `https://home-loan-score.vercel.app`)
- ✅ Custom domain support (opsional)
- ✅ Automatic HTTPS
- ✅ Analytics included
- ✅ Preview deploys untuk setiap branch

---

## Demo Aplikasi

Fitur yang akan live:

1. **Landing Page** - Penjelasan sistem penilaian
2. **Form Input** - Data identitas, pekerjaan, keuangan
3. **Auto Scoring** - Kalkulasi DSR, LTV otomatis
4. **5C Assessment** - Character, Capacity, Capital, Collateral, Condition
5. **Result Report** - Approval decision & metrics

---

## Tips

- ✨ **GitHub Integration = Terbaik** untuk automatic updates
- 📱 **Mobile Responsive** - Works di semua devices
- 🔄 **Auto Redeploy** - Update kode = auto deploy
- 📊 **Analytics** - Monitor traffic di Vercel dashboard
- 🆓 **Free Tier** - Gratis untuk unlimited projects

---

## Troubleshoot

**Build gagal?**
- Cek `.gitignore` sudah exclude `node_modules/`
- Pastikan `pnpm-lock.yaml` di-commit
- Vercel akan auto-retry jika timeout

**Mau domain custom?**
- Dashboard Vercel → Project → Settings → Domains
- Add domain Anda

**Perlu environment variables?**
- Dashboard Vercel → Settings → Environment Variables
- Add variables → Redeploy

---

## Dokumentasi Lengkap

Baca file `VERCEL_DEPLOY.md` untuk detail lebih lengkap:
- Konfigurasi advanced
- Environment variables
- Custom domain setup
- Analytics configuration

---

## Support

- 📖 Vercel Docs: https://vercel.com/docs
- 📘 Next.js Docs: https://nextjs.org/docs
- 💬 Vercel Support: https://vercel.com/support

---

## Status Deploy

| Item | Status |
|------|--------|
| Next.js Build | ✅ Pass |
| TypeScript | ✅ Pass |
| Dependencies | ✅ Complete |
| Bundle Size | ✅ Optimized |
| Performance | ✅ Ready |

**Semua siap! Klik tombol Deploy dan aplikasi Anda akan live dalam beberapa menit.** 🎉

---

*Last updated: May 19, 2026*
