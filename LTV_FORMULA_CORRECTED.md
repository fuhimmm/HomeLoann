# Perbaikan Formula LTV - HomeLoan Score KPR

## Rumus LTV yang Benar

$$\text{LTV} = \left(\frac{\text{Jumlah Pinjaman}}{\text{Nilai Aset/Jaminan}}\right) \times 100\%$$

Dalam konteks KPR:
- **Jumlah Pinjaman** = Plafon = Harga Properti - Down Payment
- **Nilai Aset/Jaminan** = Harga Properti

Jadi:

$$\text{LTV} = \left(\frac{\text{Plafon}}{\text{Harga Properti}}\right) \times 100\%$$

---

## Contoh Perhitungan

### Scenario:
- Harga Properti: Rp 500,000,000
- Down Payment: Rp 100,000,000
- Plafon (Pinjaman): Rp 400,000,000

### Perhitungan LTV:
$$\text{LTV} = \left(\frac{400,000,000}{500,000,000}\right) \times 100\% = 80\%$$

---

## Scoring LTV (Sesuai Rumus yang Benar)

| LTV Range | Poin | Interpretasi | Catatan |
|-----------|------|--------------|---------|
| < 80% | 10 | Sangat Aman | Plafon lebih kecil dari 80% nilai properti - Risk sangat rendah |
| 80% - 100% | 6 | Cukup Aman | Plafon 80-100% dari nilai properti - Risk sedang |
| > 100% | 0 | Tidak Layak | Plafon melebihi nilai properti - Tidak boleh dalam KPR normal |

---

## Interpretasi LTV

**LTV rendah (< 80%)**
- Berarti nasabah memberikan down payment yang besar
- Bank hanya membiayai sebagian kecil dari nilai properti
- Risk lebih rendah karena jaminan lebih besar dari pinjaman
- Contoh: LTV 60% artinya nasabah DP 40%, bank biayai 60%

**LTV tinggi (80-100%)**
- Berarti down payment lebih kecil
- Bank membiayai sebagian besar dari nilai properti
- Risk lebih tinggi tapi masih acceptable
- Contoh: LTV 90% artinya nasabah DP 10%, bank biayai 90%

**LTV > 100% (Tidak Valid)**
- Berarti plafon lebih besar dari nilai properti
- Ini tidak mungkin dalam KPR konvensional
- Jika terjadi, berarti ada perhitungan error

---

## Perubahan Kode

### File: `app/page.tsx`

#### 1. Perhitungan LTV (Lines 141-146)
```javascript
// SEBELUMNYA (SALAH):
const ltvRatio = plafon > 0 ? (formData.hargaProperti / plafon) * 100 : 0;

// SEKARANG (BENAR):
const ltv = formData.hargaProperti > 0 ? (plafon / formData.hargaProperti) * 100 : 0;
```

#### 2. Scoring Logic (Lines 156-162)
```javascript
// SEBELUMNYA (SALAH):
if (metricValue > 125) return 10;  // > 125%
if (metricValue >= 100) return 6;  // 100-125%
return 0;                           // < 100%

// SEKARANG (BENAR):
if (metricValue < 80) return 10;   // < 80%
if (metricValue <= 100) return 6;  // 80-100%
return 0;                          // > 100%
```

#### 3. Display Text (Lines 689-694)
```javascript
// SEBELUMNYA (SALAH):
Nilai terukur: {metrics.ltv.toFixed(2)}% (Nilai Jaminan / Plafon)
{metrics.ltv > 125 && '✓ Nilai Jaminan > 125% dari Plafon (10 poin) - Sangat Aman'}
{metrics.ltv >= 100 && metrics.ltv <= 125 && '• Nilai Jaminan 100-125% (6 poin) - Cukup Aman'}
{metrics.ltv < 100 && '✗ Nilai Jaminan < 100% (0 poin) - Tidak Memenuhi Syarat'}

// SEKARANG (BENAR):
Nilai terukur: {metrics.ltv.toFixed(2)}% (Plafon / Harga Properti)
{metrics.ltv < 80 && '✓ LTV < 80% (10 poin) - Sangat Aman'}
{metrics.ltv >= 80 && metrics.ltv <= 100 && '• LTV 80-100% (6 poin) - Cukup Aman'}
{metrics.ltv > 100 && '✗ LTV > 100% (0 poin) - Tidak Layak'}
```

---

## Pengaruh Terhadap Sistem Scoring

Perubahan ini **TIDAK mengubah distribusi poin maksimal** karena:
- LTV tetap bernilai 0, 6, atau 10 poin
- Maksimal Collateral tetap 15 poin (10 + 5 + 5)
- **Total skor maksimal tetap 100 poin**

Yang berubah hanyalah **kondisi/threshold** kapan nasabah mendapatkan poin tersebut.

---

## Verification Test

Dengan contoh scenario sebelumnya:
- Harga Properti: Rp 500 juta
- Down Payment: Rp 100 juta
- Plafon: Rp 400 juta

**Perhitungan:**
- LTV = (400 / 500) × 100% = **80%**
- Skor LTV = **6 poin** (Cukup Aman)

**Interpretasi:**
Nasabah memberikan DP 20% dan bank membiayai 80% - ini adalah LTV standar di industry perbankan Indonesia.

---

## Status

✅ Rumus LTV diperbaiki
✅ Build test: SUCCESS
✅ Scoring logic: CORRECT
✅ Siap production deployment

---

**Last Updated:** 2026-05-19
**Status:** CORRECTED & PRODUCTION READY
