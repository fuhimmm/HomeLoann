# KPR Score Calculator - Penilaian Pinjaman Rumah Dua Tahap Wajib

Aplikasi assessment lengkap untuk mengevaluasi kelayakan pinjaman KPR (Kredit Pemilikan Rumah) dengan sistem penilaian **dua tahap wajib**: **TAHAP 1 (Penyaringan DBR)** dan **TAHAP 2 (Penilaian Skor 5C)** dengan maximum score 100 poin.

## Alur Penilaian Dua Tahap

```
┌──────────────────────────────────────────┐
│  TAHAP 1: PENYARINGAN DBR (MANDATORY)    │
│  ──────────────────────────────────────  │
│  Input:                                  │
│  • Pendapatan bersih bulanan (Rp)        │
│  • Total cicilan berjalan (Rp)           │
│  • Harga properti, DP, tenor, bunga      │
│  • Tipe pekerjaan                        │
│                                          │
│  Output Auto-Calculate:                  │
│  • Pokok pinjaman & cicilan KPR baru    │
│  • DBR (Debt Burden Ratio)               │
│  • DSR (Debt Service Ratio)              │
│  • LTV (Loan to Value)                   │
└────────────────────┬─────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  DBR ≤ 50%?             │
        │  ──────────             │
        │  Ya  ┌────────┐         │
        │  Tidak │      │         │
        └───────┼──────┼─────────┘
                │      │
        ┌───────┘      └──────────┐
        │                         │
        ▼                         ▼
   [LANJUT]                  [DITOLAK]
      │                          │
      │                          └──> SELESAI (Pinjaman Ditolak)
      │
      ▼
┌──────────────────────────────────────────┐
│  TAHAP 2: PENILAIAN SKOR 5C (MANDATORY)  │
│  ──────────────────────────────────────  │
│  Total: 100 Poin Max                     │
│  • Character (Karakter): 30 poin         │
│  • Capacity (Kapasitas): 25 poin         │
│  • Capital (Modal): 20 poin              │
│  • Collateral (Jaminan): 15 poin         │
│  • Condition (Kondisi): 10 poin          │
│                                          │
│  Setiap parameter: 0, 6, atau 10 poin   │
└────────────────────┬─────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ HASIL AKHIR             │
        │ ────────────────────    │
        │ 80-100: Layak Disetujui │
        │ 65-79:  Dipertimbangkan │
        │ 50-64:  Risiko Tinggi   │
        │ <50:    Ditolak         │
        └─────────────────────────┘
```

## TAHAP 1: Penyaringan DBR (Mandatory)

Merupakan screening awal wajib yang menentukan kelayakan dasar calon peminjam berdasarkan kemampuan pembayaran.

**Input Fields:**
- Pendapatan Bersih Bulanan (Rp)
- Total Cicilan Berjalan (Rp) - default 0
- Harga Properti (Rp)
- Uang Muka / DP (Rp)
- Tenor KPR: Dropdown [5, 10, 15, 20, 25, 30] tahun
- Suku Bunga (%/Tahun)
- Tipe Pekerjaan: Pegawai / Wiraswasta

**Auto-Calculated Display:**
- Pokok Pinjaman = Harga Properti - DP
- Cicilan KPR Baru (amortization formula)
- Total Cicilan Bulanan = Cicilan KPR Baru + Cicilan Berjalan
- **DBR = (Total Cicilan / Pendapatan) × 100%**
- **DSR = (Cicilan KPR Baru / Pendapatan) × 100%**
- **LTV = (Pokok Pinjaman / Harga Properti) × 100%**

**Status DBR & Conditional Logic:**
| DBR Range | Status | Aksi |
|-----------|--------|------|
| ≤ 30% | Sangat Baik - Lolos | Tampilkan button "Lanjut ke TAHAP 2" |
| 30-40% | Masih Layak - Lolos | Tampilkan button "Lanjut ke TAHAP 2" |
| 40-50% | Risiko Tinggi - Dipertimbangkan | Tampilkan button "Lanjut ke TAHAP 2" |
| > 50% | Tidak Lolos - Ditolak | **STOP** - Sembunyikan TAHAP 2, tampilkan rejection message |

**Penting:** Jika DBR > 50%, pinjaman **langsung ditolak** dan TAHAP 2 tidak ditampilkan.

## TAHAP 2: Penilaian Skor 5C (Mandatory jika Lolos DBR)

**Hanya ditampilkan jika lolos DBR (DBR ≤ 50%)**

Penilaian komprehensif calon peminjam menggunakan metode 5C dengan total score 100 poin.

### A. CHARACTER (Karakter) - 30 Poin Max
6 Parameter, setiap 10/6/0:
1. Hubungan dengan Bank
2. Riwayat Kredit
3. Kedisiplinan Pembayaran
4. Reputasi & Kepribadian
5. Stabilitas Tempat Tinggal
6. Catatan Hukum

**Rumus:** (Total Raw / 60) × 30

### B. CAPACITY (Kapasitas) - 25 Poin Max
4 Parameter (2 auto, 2 conditional):
1. **DSR** - OTOMATIS dari TAHAP 1 (disabled field)
2. Stabilitas Pendapatan
3. Pertumbuhan Keuntungan - **Conditional: Hidden jika Pegawai**
4. **BOPO** - **Conditional: Hidden jika Pegawai** (default 10 untuk pegawai)

**Rumus:** (Total Raw / 40) × 25

### C. CAPITAL (Modal) - 20 Poin Max
3 Parameter, setiap 10/6/0:
1. Modal Sendiri / DP
2. Debt to Equity Ratio
3. Aset Likuid / Simpanan

**Rumus:** (Total Raw / 30) × 20

### D. COLLATERAL (Jaminan) - 15 Poin Max
3 Parameter:
1. **LTV** - OTOMATIS dari TAHAP 1 (disabled field) - 10/6/0
2. Likuiditas Jaminan - 10/6/0
3. Legalitas Jaminan - 10/6/0

**Rumus:** (Total Raw / 30) × 15

### E. CONDITION (Kondisi) - 10 Poin Max
2 Parameter, setiap 10/6/0:
1. Jenis Pekerjaan & Masa Kerja
2. Prospek Sektor Usaha/Industri

**Rumus:** (Total Raw / 20) × 10

## Hasil Akhir (TAHAP 3)

Menampilkan hasil penilaian lengkap dengan breakdown 5C dan final decision.

**Display:**
- Ringkasan TAHAP 1: DBR%, Status, Cicilan/Bulan, LTV
- Breakdown 5C: Card/chart untuk setiap pilar dengan skor
- Total Score (0-100) dengan visual blue gradient
- Final Decision dengan color-coded status:
  - **80-100: Layak Disetujui** (Hijau)
  - **65-79: Dipertimbangkan** (Kuning)
  - **50-64: Risiko Tinggi** (Oranye)
  - **<50: Ditolak** (Merah)
- Buttons: "Mulai Ulang" (reset semua), "Cetak Hasil" (print-friendly)

## Teknologi Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (useState, useEffect)
- **Language**: TypeScript
- **Deployment**: Vercel ready

## Struktur File

```
app/
├── layout.tsx         # Root layout dengan metadata
├── page.tsx          # Main application - Semua tahap penilaian
components/
├── ui/              # shadcn/ui components (default dari template)
hooks/
├── use-mobile.tsx   # Responsive design hook
lib/
├── utils.ts         # Utility functions (cn helper)
public/              # Static assets
globals.css          # Tailwind + design tokens
```

## Cara Penggunaan

1. **TAHAP 1 - Penyaringan DBR**: 
   - Isi data properti dan pendapatan
   - Klik "Hitung DBR"
   - Lihat hasil DBR calculation
   - Jika lolos (≤50%), klik "Lanjut ke TAHAP 2"
   - Jika ditolak (>50%), hasil akhir = REJECTED

2. **TAHAP 2 - Penilaian 5C** (jika lolos TAHAP 1):
   - Isi semua 5C parameter via radio buttons
   - DSR dan LTV otomatis terisi dari TAHAP 1
   - Conditional fields appear based on job type
   - Klik "Lihat Hasil" untuk melanjut

3. **TAHAP 3 - Hasil Akhir**:
   - Lihat breakdown DBR dan 5C scores
   - Total score 0-100 dan keputusan final
   - Buttons: "Mulai Ulang" atau "Cetak Hasil"

## Kriteria Keputusan Final

### Skor 5C Total
| Skor | Status | Keputusan |
|------|--------|-----------|
| 80 - 100 | ✅ | **Layak Disetujui** - Approval penuh |
| 65 - 79 | ⚠️ | **Dipertimbangkan** - Conditional, review khusus |
| 50 - 64 | ⚠️ | **Risiko Tinggi** - Pertimbangkan pinjaman lebih kecil |
| < 50 | ❌ | **Ditolak** - Tidak memenuhi kriteria |

**Penting:** DBR > 50% = instant rejection tanpa penilaian 5C

## Running the Application

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser at http://localhost:3000
```

## Formula Perhitungan

### TAHAP 1: DBR Calculation

**Amortization Formula untuk cicilan KPR:**
```
Monthly Loan Payment = L × [r(1+r)^n] / [(1+r)^n - 1]

Dimana:
- L = Loan Amount (Pokok Pinjaman)
- r = Monthly Interest Rate (Bunga Tahunan / 12 / 100)
- n = Total Months (Tenor × 12)

Total Monthly Payment = Monthly Loan Payment + Cicilan Berjalan

DBR = (Total Monthly Payment / Pendapatan Bulanan) × 100%
DSR = (Monthly Loan Payment / Pendapatan Bulanan) × 100%
LTV = (Pokok Pinjaman / Harga Properti) × 100%
```

### TAHAP 2: 5C Score Normalization

Setiap pilar dinormalisasi dari raw points ke max points:
```
Character Score = (Total Raw / 60) × 30
Capacity Score = (Total Raw / 40) × 25
Capital Score = (Total Raw / 30) × 20
Collateral Score = (Total Raw / 30) × 15
Condition Score = (Total Raw / 20) × 10

Total Score = Character + Capacity + Capital + Collateral + Condition
Total Max = 100 points
```

## Catatan Penting

### Dua Tahap Wajib (Mandatory)
- **TAHAP 1 (DBR)** HARUS diselesaikan sebelum TAHAP 2 dapat diakses
- **DBR > 50% = Instant Rejection** → TAHAP 2 tidak ditampilkan, penilaian selesai
- **TAHAP 2 (5C)** hanya bisa diakses jika lolos TAHAP 1 (DBR ≤ 50%)

### Auto-Calculated & Read-Only Fields
- **DBR, DSR, LTV** di TAHAP 1 dihitung otomatis dan tidak bisa diubah
- **DSR field** di TAHAP 2 (Capacity) otomatis terisi dari TAHAP 1 (disabled)
- **LTV field** di TAHAP 2 (Collateral) otomatis terisi dari TAHAP 1 (disabled)

### Conditional Fields
- **Profit Growth** (Pertumbuhan Keuntungan) - Hidden jika Pegawai, visible jika Wiraswasta
- **BOPO** (Operational Ratio) - Hidden jika Pegawai, visible jika Wiraswasta
- Default value untuk Pegawai: BOPO = 10 poin (maksimal)

### Data & State Management
- Semua data disimpan di client-side React state
- Data tidak tersimpan permanen - refresh = clear all
- Untuk production: tambahkan backend database + API routes

### Future Enhancements
- Database (Supabase/Neon) untuk persistent storage
- Authentication & user accounts
- File upload untuk dokumen pendukung
- Email/SMS notification
- Admin dashboard & analytics
- BI Checking integration
- Print-to-PDF with watermark
- Multi-language support
