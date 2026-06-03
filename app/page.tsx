'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { InterestRateSection } from '@/components/interest-rate-section';

interface FormData {
  // Identitas
  namaLengkap: string;
  noIdentitas: string;
  alamat: string;
  noTelepon: string;

  // Pekerjaan
  jenisPekerjaan: 'pns' | 'swasta_tetap' | 'kontrak' | 'wiraswasta' | 'harian' | '';
  jabatan: 'direktur' | 'manajer' | 'supervisor' | 'staff' | 'lainnya' | '';
  masaKerjaTahun: 1 | 2 | 3 | 4 | 5 | 6 | '6+' | '';
  
  // Kondisi Nasabah
  jumlahTanggungan: number | '';
  pengeluaranRutin: number | '';

  // Pendapatan & Modal
  pendapatanBersih: number | '';
  cicilanBerjalan: number | '';
  asetLikuid: number | '';
  totalHutang: number | '';
  totalModal: number | '';

  // Properti
  hargaProperti: number | '';
  dp: number | '';
  tenor: 5 | 10 | 15 | 20 | 25 | 30 | '';
  sukuBunga: number | '';
  tipeBunga: 'fixed' | 'berjenjang' | 'floating' | '';

  // Character (6 params) - Max 60 poin (10 poin per param)
  hubunganBank: 0 | 6 | 10 | '';
  riwayatKredit: 0 | 6 | 10 | '';
  kedisiplinan: 0 | 6 | 10 | '';
  reputasi: 0 | 6 | 10 | '';
  stabilitasTinggal: 0 | 6 | 10 | '';
  catatanHukum: 0 | 6 | 10 | '';

  // Capacity (3 params) - Max 30 poin (10 poin per param)
  dsr: 0 | 6 | 10 | '';
  stabilitasPendapatan: 0 | 6 | 10 | '';
  pertumbuhanKeuntungan: 0 | 6 | 10 | '';

  // Capital (3 params) - Max 30 poin (10 poin per param)
  selfFinancing: 0 | 6 | 10 | '';
  der: 0 | 6 | 10 | '';
  asetLikuidScore: 0 | 6 | 10 | '';

  // Collateral (3 params) - Max 20 poin (6-10 poin per param)
  ltv: 0 | 6 | 10 | '';
  likuiditasJaminan: 0 | 6 | 10 | '';
  legalitasJaminan: 0 | 6 | 10 | '';

  // Condition (4 params) - Max 40 poin (10 poin per param)
  jenisPekerjaanScore: 0 | 6 | 10 | '';
  masaKerjaScore: 0 | 6 | 10 | '';
  tanggunganScore: 0 | 6 | 10 | '';
  pengeluaranScore: 0 | 6 | 10 | '';
}

interface ScoringResult {
  character: number;
  capacity: number;
  capital: number;
  collateral: number;
  condition: number;
  total: number;
  decision: 'approved' | 'considered' | 'risky' | 'rejected';
  metrics: {
    dbr: number;
    dsr: number;
    ltv: number;
    der: number;
    cicilan: number;
    plafon: number;
  };
}

export default function Home() {
  const [stage, setStage] = useState<'landing' | 'form' | 'scoring' | 'results'>('landing');
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: '',
    noIdentitas: '',
    alamat: '',
    noTelepon: '',
    jenisPekerjaan: '',
    jabatan: '',
    masaKerjaTahun: '',
    jumlahTanggungan: '',
    pengeluaranRutin: '',
    pendapatanBersih: '',
    cicilanBerjalan: '',
    asetLikuid: '',
    totalHutang: '',
    totalModal: '',
    hargaProperti: '',
    dp: '',
    tenor: '',
    sukuBunga: '',
    tipeBunga: '',
    hubunganBank: '',
    riwayatKredit: '',
    kedisiplinan: '',
    reputasi: '',
    stabilitasTinggal: '',
    catatanHukum: '',
    dsr: '',
    stabilitasPendapatan: '',
    pertumbuhanKeuntungan: '',
    selfFinancing: '',
    der: '',
    asetLikuidScore: '',
    ltv: '',
    likuiditasJaminan: '',
    legalitasJaminan: '',
    jenisPekerjaanScore: '',
    masaKerjaScore: '',
    tanggunganScore: '',
    pengeluaranScore: '',
  });
  const [result, setResult] = useState<ScoringResult | null>(null);

  // Hitung metrik-metrik otomatis
  const metrics = useMemo(() => {
    const hargaProperti = formData.hargaProperti || 0;
    const dp = formData.dp || 0;
    const sukuBunga = formData.sukuBunga || 0;
    const tenor = formData.tenor || 0;
    const cicilanBerjalan = formData.cicilanBerjalan || 0;
    const pendapatanBersih = formData.pendapatanBersih || 0;
    const totalHutang = formData.totalHutang || 0;
    const totalModal = formData.totalModal || 0;
    const totalBiayaOperasional = formData.totalBiayaOperasional || 0;
    const totalPendapatanOperasional = formData.totalPendapatanOperasional || 0;

    const plafon = hargaProperti - dp;
    const monthlyRate = sukuBunga / 100 / 12;
    const nMonths = tenor * 12;

    let cicilan = 0;
    if (monthlyRate > 0 && nMonths > 0) {
      cicilan =
        plafon *
        (monthlyRate * Math.pow(1 + monthlyRate, nMonths)) /
        (Math.pow(1 + monthlyRate, nMonths) - 1);
    } else {
      cicilan = tenor > 0 ? plafon / (tenor * 12) : 0;
    }

    const totalCicilan = cicilan + cicilanBerjalan;
    const dbr = pendapatanBersih > 0 ? (totalCicilan / pendapatanBersih) * 100 : 0;
    const dsr = pendapatanBersih > 0 ? (cicilan / pendapatanBersih) * 100 : 0;
    const ltv = hargaProperti > 0 ? (plafon / hargaProperti) * 100 : 0;
    const der = totalModal > 0 ? totalHutang / totalModal : 0;

    return { dbr, dsr, ltv, der, cicilan, plafon };
  }, [formData]);

  // Auto-lock scoring berdasarkan hasil perhitungan
  const getAutoLockedScore = (metricName: string, metricValue: number): (0 | 6 | 10 | '') => {
    switch (metricName) {
      case 'dsr':
        if (metricValue <= 30) return 10;
        if (metricValue <= 50) return 6;
        return 0;
      case 'ltv':
        // LTV = Plafon / Harga Properti × 100%
        // < 80% = 10 poin (sangat aman - plafon kecil)
        // 80-100% = 6 poin (cukup aman - plafon cukup)
        // > 100% = 0 poin (tidak layak - plafon melebihi nilai aset)
        if (metricValue < 80) return 10;
        if (metricValue <= 100) return 6;
        return 0;
      case 'bopo':
        if (metricValue <= 50) return 10;
        if (metricValue <= 75) return 6;
        return 0;
      default:
        return '';
    }
  };

  // Get auto score for jenis pekerjaan
  const getJenisPekerjaanScore = (): (0 | 6 | 10) => {
    switch (formData.jenisPekerjaan) {
      case 'pns':
        return 10;
      case 'swasta_tetap':
        return 10;
      case 'kontrak':
        return 6;
      case 'wiraswasta':
        return 6;
      default:
        return 0;
    }
  };

  // Auto-update DSR, LTV scores ketika metrics berubah
  useEffect(() => {
    const dsrScore = getAutoLockedScore('dsr', metrics.dsr);
    const ltvScore = getAutoLockedScore('ltv', metrics.ltv);
    
    setFormData((prev) => ({
      ...prev,
      dsr: dsrScore,
      ltv: ltvScore,
    }));
  }, [metrics]);

  // Format angka ke Rupiah untuk display (tanpa ,00 saat mengetik)
  const formatRupiah = (value: number | ''): string => {
    if (value === '') return '';
    // Format: Rp1.000.000
    return 'Rp' + value.toLocaleString('id-ID');
  };

  // Format Rupiah lengkap dengan ,00 untuk display hasil
  const formatRupiahFull = (value: number): string => {
    return 'Rp' + value.toLocaleString('id-ID', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Handle input uang - ambil angka saja
  const handleMoneyInput = (field: keyof FormData, value: string) => {
    // Hapus semua karakter kecuali angka
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly === '') {
      setFormData((prev) => ({ ...prev, [field]: '' }));
      return;
    }
    const numValue = parseInt(digitsOnly, 10);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    // Jangan update DSR, BOPO, LTV - auto-locked
    if (field === 'dsr' || field === 'bopo' || field === 'ltv') {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? '' : value,
    }));
  };

  const handleProcess = () => {
    // Validasi DBR dulu
    if (metrics.dbr > 50) {
      setResult({
        character: 0,
        capacity: 0,
        capital: 0,
        collateral: 0,
        condition: 0,
        total: 0,
        decision: 'rejected',
        metrics,
      });
      setStage('results');
      return;
    }

    // Hitung skor
    const characterScore =
      (formData.hubunganBank || 0) +
      (formData.riwayatKredit || 0) +
      (formData.kedisiplinan || 0) +
      (formData.reputasi || 0) +
      (formData.stabilitasTinggal || 0) +
      (formData.catatanHukum || 0);

    const capacityScore =
      (formData.dsr || 0) +
      (formData.stabilitasPendapatan || 0) +
      (formData.pertumbuhanKeuntungan || 0);

    const capitalScore =
      (formData.selfFinancing || 0) +
      (formData.der || 0) +
      (formData.asetLikuidScore || 0);

    const collateralScore =
      (formData.ltv || 0) +
      (formData.likuiditasJaminan || 0) +
      (formData.legalitasJaminan || 0);

    // Hitung skor Condition otomatis berdasarkan data nasabah
    // Jenis Pekerjaan Score
    let jenisPekerjaanScore = 0;
    if (formData.jenisPekerjaan === 'pns' || formData.jenisPekerjaan === 'swasta_tetap') {
      jenisPekerjaanScore = 10;
    } else if (formData.jenisPekerjaan === 'wiraswasta' || formData.jenisPekerjaan === 'kontrak') {
      jenisPekerjaanScore = 6;
    } else if (formData.jenisPekerjaan === 'harian') {
      jenisPekerjaanScore = 0;
    }

    // Masa Kerja Score
    let masaKerjaScore = 0;
    const masaKerja = formData.masaKerjaTahun;
    if (masaKerja === '6+' || masaKerja === 6 || masaKerja === 5) {
      masaKerjaScore = 10;
    } else if (masaKerja === 3 || masaKerja === 4) {
      masaKerjaScore = 6;
    } else if (masaKerja === 1 || masaKerja === 2) {
      masaKerjaScore = 0;
    }

    // Tanggungan Score
    let tanggunganScore = 0;
    const tanggungan = formData.jumlahTanggungan || 0;
    if (tanggungan <= 1) {
      tanggunganScore = 10;
    } else if (tanggungan <= 3) {
      tanggunganScore = 6;
    } else {
      tanggunganScore = 0;
    }

    // Pengeluaran Score
    let pengeluaranScore = 0;
    const pendapatan = formData.pendapatanBersih || 0;
    const pengeluaran = formData.pengeluaranRutin || 0;
    const rasiopengeluaran = pendapatan > 0 ? (pengeluaran / pendapatan) * 100 : 0;
    if (rasiopengeluaran < 30) {
      pengeluaranScore = 10;
    } else if (rasiopengeluaran <= 50) {
      pengeluaranScore = 6;
    } else {
      pengeluaranScore = 0;
    }

    const conditionScore = jenisPekerjaanScore + masaKerjaScore + tanggunganScore + pengeluaranScore;

    const total = characterScore + capacityScore + capitalScore + collateralScore + conditionScore;

    // Total max = 180 (Character 60 + Capacity 30 + Capital 30 + Collateral 20 + Condition 40)
    let decision: 'approved' | 'considered' | 'risky' | 'rejected' = 'rejected';
    if (total >= 140) decision = 'approved';      // >= ~78% dari 180
    else if (total >= 115) decision = 'considered'; // >= ~64% dari 180
    else if (total >= 90) decision = 'risky';       // >= ~50% dari 180

    setResult({
      character: characterScore,
      capacity: capacityScore,
      capital: capitalScore,
      collateral: collateralScore,
      condition: conditionScore,
      total,
      decision,
      metrics,
    });

    setStage('results');
  };

  const handleReset = () => {
    setFormData({
      namaLengkap: '',
      noIdentitas: '',
      alamat: '',
      noTelepon: '',
      jenisPekerjaan: '',
      jabatan: '',
      masaKerjaTahun: '',
      jumlahTanggungan: '',
      pengeluaranRutin: '',
      pendapatanBersih: '',
      cicilanBerjalan: '',
      asetLikuid: '',
      totalHutang: '',
      totalModal: '',
      hargaProperti: '',
      dp: '',
      tenor: '',
      sukuBunga: '',
      tipeBunga: '',
      hubunganBank: '',
      riwayatKredit: '',
      kedisiplinan: '',
      reputasi: '',
      stabilitasTinggal: '',
      catatanHukum: '',
      dsr: '',
      stabilitasPendapatan: '',
      pertumbuhanKeuntungan: '',
      bopo: '',
      selfFinancing: '',
      der: '',
      asetLikuidScore: '',
      ltv: '',
      likuiditasJaminan: '',
      legalitasJaminan: '',
      jenisPekerjaanScore: '',
      masaKerjaScore: '',
      tanggunganScore: '',
      pengeluaranScore: '',
    });
    setResult(null);
    setStage('landing');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-900 text-white border-b border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">HomeScore</h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Penilaian Kelayakan Kredit Properti</p>
          </div>
          {stage !== 'landing' && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded transition text-sm"
            >
              Mulai Ulang
            </button>
          )}
        </div>
      </header>

      {/* Landing */}
      {stage === 'landing' && (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Penilaian Kelayakan KPR</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistem penilaian berbasis analisis 5C untuk mengevaluasi kelayakan calon debitur
            dengan perhitungan transparan dan detail
          </p>
          <button
            onClick={() => setStage('form')}
            className="px-8 py-3 bg-blue-900 text-white rounded font-semibold hover:bg-blue-800 transition"
          >
            Mulai Penilaian
          </button>
        </div>
      )}

      {/* Form Stage */}
      {stage === 'form' && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Left - Form Inputs */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Identitas */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Data Identitas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.namaLengkap}
                    onChange={(e) => handleInputChange('namaLengkap', e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="No. Identitas"
                    value={formData.noIdentitas}
                    onChange={(e) => handleInputChange('noIdentitas', e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="Alamat"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                  />
                  <input
                    type="text"
                    placeholder="No. Telepon"
                    value={formData.noTelepon}
                    onChange={(e) => handleInputChange('noTelepon', e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                  />
                </div>
              </Card>

              {/* Pekerjaan */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Data Pekerjaan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <select
                    value={formData.jenisPekerjaan}
                    onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  >
                    <option value="">Pilih Jenis Pekerjaan</option>
                    <option value="pns">PNS / BUMN / Pegawai Tetap Perusahaan Bonafid</option>
                    <option value="swasta_tetap">Pegawai Swasta Tetap</option>
                    <option value="wiraswasta">Wiraswasta</option>
                    <option value="kontrak">Pegawai Swasta Kontrak</option>
                    <option value="harian">Pekerja Harian / Tidak Tetap</option>
                  </select>
                  <select
                    value={formData.jabatan}
                    onChange={(e) => handleInputChange('jabatan', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  >
                    <option value="">Pilih Jabatan</option>
                    <option value="direktur">Direktur</option>
                    <option value="manajer">Manajer</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="staff">Staff</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                  <select
                    value={formData.masaKerjaTahun === '' ? '' : formData.masaKerjaTahun}
                    onChange={(e) => handleInputChange('masaKerjaTahun', e.target.value === '' ? '' : e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  >
                    <option value="">Pilih Masa Kerja</option>
                    <option value="1">1 Tahun</option>
                    <option value="2">2 Tahun</option>
                    <option value="3">3 Tahun</option>
                    <option value="4">4 Tahun</option>
                    <option value="5">5 Tahun</option>
                    <option value="6+">6+ Tahun</option>
                  </select>
                </div>
              </Card>

              {/* Kondisi Nasabah */}
              <Card className="p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Kondisi Nasabah</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Jumlah Tanggungan Keluarga</label>
                    <input
                      type="text"
                      placeholder="0"
                      value={formData.jumlahTanggungan === '' ? '' : formData.jumlahTanggungan}
                      onChange={(e) => handleInputChange('jumlahTanggungan', e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Pengeluaran Rutin Bulanan</label>
                    <input
                      type="text"
                      placeholder="Rp0"
                      value={formatRupiah(formData.pengeluaranRutin)}
                      onChange={(e) => handleMoneyInput('pengeluaranRutin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">Biaya makan, transportasi, pendidikan, tagihan, dll (di luar cicilan)</p>
                  </div>
                </div>
              </Card>

              {/* Pendapatan & Modal */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Keuangan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5">Pendapatan Bersih</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.pendapatanBersih)}
                      onChange={(e) => handleMoneyInput('pendapatanBersih', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5">Cicilan Berjalan</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.cicilanBerjalan)}
                      onChange={(e) => handleMoneyInput('cicilanBerjalan', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5">Aset Likuid</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.asetLikuid)}
                      onChange={(e) => handleMoneyInput('asetLikuid', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5">Total Hutang</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.totalHutang)}
                      onChange={(e) => handleMoneyInput('totalHutang', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5">Total Modal</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.totalModal)}
                      onChange={(e) => handleMoneyInput('totalModal', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                </div>
              </Card>

              {/* Properti */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Simulasi KPR</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Harga Properti</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.hargaProperti)}
                      onChange={(e) => handleMoneyInput('hargaProperti', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Uang Muka</label>
                    <input
                      type="text"
                      placeholder="Rp0,00"
                      value={formatRupiah(formData.dp)}
                      onChange={(e) => handleMoneyInput('dp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Jangka Waktu (Tenor)</label>
                    <select
                      value={formData.tenor === '' ? '' : formData.tenor}
                      onChange={(e) => handleInputChange('tenor', e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                    >
                      <option value="">Pilih Tenor</option>
                      <option value="5">5 Tahun</option>
                      <option value="10">10 Tahun</option>
                      <option value="15">15 Tahun</option>
                      <option value="20">20 Tahun</option>
                      <option value="25">25 Tahun</option>
                      <option value="30">30 Tahun</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Interest Rate Section */}
              <InterestRateSection
                tipeBunga={formData.tipeBunga}
                sukuBunga={formData.sukuBunga}
                tenor={formData.tenor}
                onTipeChange={(tipe) => handleInputChange('tipeBunga', tipe)}
                onRateChange={(rate) => handleInputChange('sukuBunga', rate)}
              />

              {/* Character Scoring */}
              <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Character (Karakter Nasabah)</h3>
                <div className="space-y-3 sm:space-y-4">
                  <ScoreOption
                    label="1. Hubungan dengan Bank"
                    options={[
                      { value: 10, label: 'Pernah Pinjaman Lunas' },
                      { value: 6, label: 'Sedang Punya Pinjaman Lancar' },
                      { value: 6, label: 'Sedang Punya Tabungan' },
                      { value: 0, label: 'Nasabah Baru' },
                    ]}
                    value={formData.hubunganBank}
                    onChange={(v) => handleInputChange('hubunganBank', v)}
                  />
                  <ScoreOption
                    label="2. Riwayat Kredit (SLIK/BI Checking)"
                    options={[
                      { value: 10, label: 'Kolektibilitas 1 / Lancar' },
                      { value: 6, label: 'Kolektibilitas 2 / Dalam Perhatian Khusus' },
                      { value: 0, label: 'Kolektibilitas 3-5 / Kurang Lancar-Macet' },
                    ]}
                    value={formData.riwayatKredit}
                    onChange={(v) => handleInputChange('riwayatKredit', v)}
                  />
                  <ScoreOption
                    label="3. Kedisiplinan Pembayaran"
                    options={[
                      { value: 10, label: 'Selalu Tepat Waktu' },
                      { value: 6, label: 'Kadang Terlambat' },
                      { value: 0, label: 'Sering Terlambat / Menunggak' },
                    ]}
                    value={formData.kedisiplinan}
                    onChange={(v) => handleInputChange('kedisiplinan', v)}
                  />
                  <ScoreOption
                    label="4. Reputasi dan Kepribadian"
                    options={[
                      { value: 10, label: 'Sangat Baik' },
                      { value: 6, label: 'Cukup Baik' },
                      { value: 0, label: 'Kurang Baik' },
                    ]}
                    value={formData.reputasi}
                    onChange={(v) => handleInputChange('reputasi', v)}
                  />
                  <ScoreOption
                    label="5. Stabilitas Tempat Tinggal"
                    options={[
                      { value: 10, label: 'Tinggal Tetap > 3 Tahun' },
                      { value: 6, label: 'Tinggal 1-3 Tahun' },
                      { value: 0, label: '< 1 Tahun / Sering Pindah' },
                    ]}
                    value={formData.stabilitasTinggal}
                    onChange={(v) => handleInputChange('stabilitasTinggal', v)}
                  />
                  <ScoreOption
                    label="6. Catatan Hukum / Masalah Keuangan"
                    options={[
                      { value: 10, label: 'Tidak Pernah Bermasalah' },
                      { value: 6, label: 'Pernah Masalah Ringan' },
                      { value: 0, label: 'Masalah Serius' },
                    ]}
                    value={formData.catatanHukum}
                    onChange={(v) => handleInputChange('catatanHukum', v)}
                  />
                </div>
              </Card>

              {/* Capacity Scoring */}
              <Card className="p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Capacity (Kapasitas Bayar)</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <div>
                      <p className="font-semibold text-blue-900">1. Debt Service Ratio (DSR)</p>
                      <p className="text-sm text-gray-600 mt-1">Nilai terukur: {metrics.dsr.toFixed(2)}%</p>
                    </div>
                  </div>
                  <ScoreOption
                    label="2. Stabilitas Pendapatan / Pekerjaan"
                    options={[
                      { value: 10, label: 'Pegawai Tetap / Usaha > 5 Tahun' },
                      { value: 6, label: 'Pegawai Kontrak / Usaha 2-5 Tahun' },
                      { value: 0, label: 'Bekerja < 1 Tahun / Usaha Baru' },
                    ]}
                    value={formData.stabilitasPendapatan}
                    onChange={(v) => handleInputChange('stabilitasPendapatan', v)}
                  />
                  <ScoreOption
                    label="3. Pertumbuhan Keuntungan"
                    options={[
                      { value: 10, label: 'Meningkat' },
                      { value: 6, label: 'Stabil' },
                      { value: 0, label: 'Menurun' },
                    ]}
                    value={formData.pertumbuhanKeuntungan}
                    onChange={(v) => handleInputChange('pertumbuhanKeuntungan', v)}
                  />
                </div>
              </Card>

              {/* Capital Scoring */}
              <Card className="p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Capital (Kualitas Sumber Pendapatan)</h3>
                <div className="space-y-4">
                  <ScoreOption
                    label="1. Besaran Modal Sendiri (Self-Financing)"
                    options={[
                      { value: 10, label: 'Modal Sendiri > 50%' },
                      { value: 6, label: 'Modal Sendiri 20-50%' },
                      { value: 0, label: 'Modal Sendiri < 20%' },
                    ]}
                    value={formData.selfFinancing}
                    onChange={(v) => handleInputChange('selfFinancing', v)}
                  />
                  <ScoreOption
                    label="2. Rasio Hutang terhadap Modal (DER)"
                    options={[
                      { value: 10, label: 'Hutang < Modal' },
                      { value: 6, label: 'Hutang Setara Modal' },
                      { value: 0, label: 'Hutang > Modal' },
                    ]}
                    value={formData.der}
                    onChange={(v) => handleInputChange('der', v)}
                  />
                  <ScoreOption
                    label="3. Kepemilikan Aset Likuid"
                    options={[
                      { value: 10, label: 'Aset Likuid Besar' },
                      { value: 6, label: 'Aset Likuid Cukup' },
                      { value: 0, label: 'Tidak Ada Aset Likuid' },
                    ]}
                    value={formData.asetLikuidScore}
                    onChange={(v) => handleInputChange('asetLikuidScore', v)}
                  />
                </div>
              </Card>

              {/* Collateral Scoring */}
              <Card className="p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Collateral (Jaminan)</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <div>
                      <p className="font-semibold text-blue-900">1. Loan-to-Value (LTV)</p>
                      <p className="text-sm text-gray-600 mt-1">Nilai terukur: {metrics.ltv.toFixed(2)}%</p>
                    </div>
                  </div>
                  <ScoreOption
                    label="2. Likuiditas Jaminan"
                    options={[
                      { value: 10, label: 'Sangat Likuid' },
                      { value: 6, label: 'Cukup Likuid' },
                      { value: 0, label: 'Sulit Dilikuidasi' },
                    ]}
                    value={formData.likuiditasJaminan}
                    onChange={(v) => handleInputChange('likuiditasJaminan', v)}
                  />
                  <ScoreOption
                    label="3. Legalitas Jaminan"
                    options={[
                      { value: 10, label: 'SHM Atas Nama Sendiri' },
                      { value: 6, label: 'SHGB / Atas Nama Orang Lain' },
                      { value: 0, label: 'Dokumen Tidak Lengkap / Sengketa' },
                    ]}
                    value={formData.legalitasJaminan}
                    onChange={(v) => handleInputChange('legalitasJaminan', v)}
                  />
                </div>
              </Card>

              {/* Condition Scoring */}
              <Card className="p-6 bg-white border border-gray-200 rounded">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Condition (Kondisi Kehidupan Nasabah)</h3>
                <p className="text-sm text-gray-600 mb-4">Skor dihitung otomatis berdasarkan data yang sudah diisi sebelumnya.</p>
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="font-semibold text-blue-900">1. Jenis Pekerjaan</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.jenisPekerjaan === 'pns' || formData.jenisPekerjaan === 'swasta_tetap' 
                        ? 'PNS/BUMN/Pegawai Tetap (10 poin)'
                        : formData.jenisPekerjaan === 'wiraswasta' || formData.jenisPekerjaan === 'kontrak'
                        ? 'Wiraswasta/Kontrak (6 poin)'
                        : formData.jenisPekerjaan === 'harian'
                        ? 'Pekerja Harian/Tidak Tetap (0 poin)'
                        : 'Belum dipilih'}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="font-semibold text-blue-900">2. Masa Kerja</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.masaKerjaTahun === '' 
                        ? 'Belum diisi'
                        : (formData.masaKerjaTahun as number) > 5 
                        ? `${formData.masaKerjaTahun} tahun - > 5 Tahun (10 poin)`
                        : (formData.masaKerjaTahun as number) >= 2
                        ? `${formData.masaKerjaTahun} tahun - 2-5 Tahun (6 poin)`
                        : `${formData.masaKerjaTahun} tahun - < 2 Tahun (0 poin)`}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="font-semibold text-blue-900">3. Tanggungan Keluarga</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.jumlahTanggungan === '' 
                        ? 'Belum diisi'
                        : (formData.jumlahTanggungan as number) <= 1 
                        ? `${formData.jumlahTanggungan} orang - 0-1 Tanggungan (10 poin)`
                        : (formData.jumlahTanggungan as number) <= 3
                        ? `${formData.jumlahTanggungan} orang - 2-3 Tanggungan (6 poin)`
                        : `${formData.jumlahTanggungan} orang - > 3 Tanggungan (0 poin)`}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="font-semibold text-blue-900">4. Pengeluaran Rutin</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.pendapatanBersih === '' || formData.pengeluaranRutin === ''
                        ? 'Belum lengkap (isi pendapatan dan pengeluaran)'
                        : (() => {
                            const rasio = ((formData.pengeluaranRutin as number) / (formData.pendapatanBersih as number)) * 100;
                            if (rasio < 30) return `${rasio.toFixed(1)}% dari pendapatan - < 30% (10 poin)`;
                            if (rasio <= 50) return `${rasio.toFixed(1)}% dari pendapatan - 30-50% (6 poin)`;
                            return `${rasio.toFixed(1)}% dari pendapatan - > 50% (0 poin)`;
                          })()}
                    </p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={() => setStage('scoring')}
                className="w-full py-3 bg-blue-900 text-white hover:bg-blue-800 rounded"
              >
                Proses Penilaian
              </Button>
            </div>

            {/* Right - Metrics Display */}
            <div className="lg:col-span-1 space-y-4">
              <div className="lg:sticky lg:top-6">
                <Card className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-3 sm:mb-4">Insight KPR</h4>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <MetricRow label="Plafon KPR" value={`Rp ${metrics.plafon.toLocaleString('id-ID')}`} />
                    <MetricRow label="Cicilan Bulanan" value={`Rp ${metrics.cicilan.toLocaleString('id-ID')}`} />
                    <MetricRow label="DBR" value={`${metrics.dbr.toFixed(2)}%`} status={getDBRStatus(metrics.dbr)} />
                    <MetricRow label="DSR" value={`${metrics.dsr.toFixed(2)}%`} />
                    <MetricRow label="LTV" value={`${metrics.ltv.toFixed(2)}%`} />
                    <MetricRow label="DER" value={`${metrics.der.toFixed(2)}`} />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoring Stage */}
      {stage === 'scoring' && (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Memproses Penilaian</h2>
          <p className="text-gray-600 mb-8">Sistem akan menghitung skor komprehensif berdasarkan data dan penilaian yang telah diisi</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setStage('form')} variant="outline">Kembali</Button>
            <Button onClick={handleProcess} className="bg-blue-900 text-white hover:bg-blue-800 rounded">
              Proses Sekarang
            </Button>
          </div>
        </div>
      )}

      {/* Results Stage */}
      {stage === 'results' && result && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Decision Card */}
          <Card className={`p-8 border-2 rounded text-center ${
            (result.decision === 'approved' || result.decision === 'considered') ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
            <div className="flex flex-col items-center gap-4">
              {(result.decision === 'approved' || result.decision === 'considered') ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
              <h2 className={`text-3xl font-bold ${
                (result.decision === 'approved' || result.decision === 'considered') ? 'text-green-900' : 'text-red-900'
              }`}>
                {(result.decision === 'approved' || result.decision === 'considered') ? 'Pinjaman Diterima' : 'Pinjaman Ditolak'}
              </h2>
            </div>
          </Card>

          {/* Insight Metrik - Only for Approved */}
          {(result.decision === 'approved' || result.decision === 'considered') && (
            <Card className="p-6 mt-6 border border-gray-200 rounded">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Insight Metrik Keuangan</h3>
              <ul className="space-y-3">
              {/* DBR Check */}
              {result.metrics.dbr > 50 && (
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DBR (Debt Burden Ratio) terlalu tinggi:</strong> {result.metrics.dbr.toFixed(2)}% (batas maksimal 50%). Total cicilan melebihi kemampuan bayar.
                  </span>
                </li>
              )}
              {result.metrics.dbr <= 50 && result.metrics.dbr > 30 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DBR cukup:</strong> {result.metrics.dbr.toFixed(2)}% (30-50%). Masih dalam batas wajar.
                  </span>
                </li>
              )}
              {result.metrics.dbr <= 30 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DBR sangat baik:</strong> {result.metrics.dbr.toFixed(2)}% (di bawah 30%). Kemampuan bayar sangat memadai.
                  </span>
                </li>
              )}

              {/* LTV Check */}
              {result.metrics.ltv > 100 && (
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>LTV (Loan to Value) terlalu tinggi:</strong> {result.metrics.ltv.toFixed(2)}% (batas maksimal 100%). Plafon pinjaman melebihi nilai jaminan.
                  </span>
                </li>
              )}
              {result.metrics.ltv > 80 && result.metrics.ltv <= 100 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>LTV cukup tinggi:</strong> {result.metrics.ltv.toFixed(2)}% (80-100%). Uang muka relatif kecil.
                  </span>
                </li>
              )}
              {result.metrics.ltv <= 80 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>LTV baik:</strong> {result.metrics.ltv.toFixed(2)}% (di bawah 80%). Uang muka memadai.
                  </span>
                </li>
              )}

              {/* DSR Check */}
              {result.metrics.dsr > 50 && (
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DSR (Debt Service Ratio) tinggi:</strong> {result.metrics.dsr.toFixed(2)}% (di atas 50%). Cicilan KPR terlalu besar dibanding pendapatan.
                  </span>
                </li>
              )}
              {result.metrics.dsr > 30 && result.metrics.dsr <= 50 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DSR cukup:</strong> {result.metrics.dsr.toFixed(2)}% (30-50%). Cicilan masih dalam batas wajar.
                  </span>
                </li>
              )}
              {result.metrics.dsr <= 30 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DSR sangat baik:</strong> {result.metrics.dsr.toFixed(2)}% (di bawah 30%). Cicilan sangat terjangkau.
                  </span>
                </li>
              )}

              {/* DER Check */}
              {result.metrics.der > 2 && (
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DER (Debt to Equity Ratio) tinggi:</strong> {result.metrics.der.toFixed(2)} (di atas 2). Hutang terlalu besar dibanding modal.
                  </span>
                </li>
              )}
              {result.metrics.der > 1 && result.metrics.der <= 2 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DER cukup:</strong> {result.metrics.der.toFixed(2)} (1-2). Rasio hutang terhadap modal masih wajar.
                  </span>
                </li>
              )}
              {result.metrics.der <= 1 && (
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>DER baik:</strong> {result.metrics.der.toFixed(2)} (di bawah 1). Modal lebih besar dari hutang.
                  </span>
                </li>
              )}
              </ul>
            </Card>
          )}

          {/* Cicilan untuk Diterima */}
          {(result.decision === 'approved' || result.decision === 'considered') && (
            <Card className="p-6 mt-6 border border-green-200 bg-green-50 rounded">
              <h3 className="text-lg font-bold text-green-900 mb-4">Detail Cicilan Bulanan</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-green-800 mb-1">Plafon Pinjaman</p>
                  <p className="text-2xl font-bold text-green-900">{formatRupiahFull(result.metrics.plafon)}</p>
                </div>
                <div>
                  <p className="text-sm text-green-800 mb-1">Cicilan per Bulan</p>
                  <p className="text-2xl font-bold text-green-900">{formatRupiahFull(Math.round(result.metrics.cicilan))}</p>
                </div>
                <div>
                  <p className="text-sm text-green-800 mb-1">Jangka Waktu</p>
                  <p className="text-2xl font-bold text-green-900">{formData.tenor} Tahun</p>
                </div>
                <div>
                  <p className="text-sm text-green-800 mb-1">Suku Bunga</p>
                  <p className="text-2xl font-bold text-green-900">{formData.sukuBunga}% ({formData.tipeBunga || 'Pilih'})</p>
                </div>
              </div>
            </Card>
          )}

          {/* Rekomendasi untuk Semua Kasus */}
          <Card className="p-6 mt-6 border border-gray-200 rounded">
            <h3 className="text-lg font-bold text-blue-900 mb-4">Rekomendasi</h3>
              <ul className="space-y-3">
                {result.metrics.dbr > 50 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Kurangi cicilan berjalan:</strong> Lunasi atau kurangi cicilan lain untuk menurunkan DBR di bawah 50%.
                    </span>
                  </li>
                )}
                {result.metrics.dbr > 50 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Pilih properti lebih murah:</strong> Cari properti dengan harga lebih rendah agar cicilan bulanan berkurang.
                    </span>
                  </li>
                )}
                {result.metrics.ltv > 100 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Tambah uang muka:</strong> Tingkatkan DP minimal 20% dari harga properti agar LTV di bawah 80%.
                    </span>
                  </li>
                )}
                {result.metrics.dsr > 50 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Perpanjang tenor:</strong> Pilih tenor lebih panjang untuk mengurangi cicilan bulanan.
                    </span>
                  </li>
                )}
                {result.metrics.der > 2 && (
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Kurangi hutang:</strong> Lunasi sebagian hutang untuk memperbaiki rasio DER.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    <strong>Tingkatkan pendapatan:</strong> Cari sumber pendapatan tambahan atau tunggu kenaikan gaji.
                  </span>
                </li>
              </ul>
            </Card>

          <div className="flex gap-4 mt-8 justify-center">
            <Button onClick={handleReset} className="bg-blue-900 text-white hover:bg-blue-800 rounded">
              Mulai Ulang
            </Button>
          </div>

          {/* Credits */}
          <div className="text-center mt-12">
            <p className="text-xs text-gray-400">Adinda, Dinda, Eva, Khaliza</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function ScoreOption({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: number; label: string }[];
  value: number | '';
  onChange: (v: number) => void;
}) {
  return (
    <div className="border border-gray-200 rounded p-4 bg-gray-50">
      <p className="text-sm font-semibold text-gray-900 mb-3">{label}</p>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}) {
  const percentage = (score / maxScore) * 100;
  return (
    <Card className="p-4 bg-white border border-gray-200 rounded">
      <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
      <p className="text-2xl font-bold text-blue-900 mb-2">{score}</p>
      <div className="w-full bg-gray-200 rounded h-2">
        <div
          className="bg-blue-600 h-2 rounded transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-2">dari {maxScore} poin</p>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      <span className="text-gray-700">{label}</span>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{value}</p>
        {status && <p className="text-xs text-gray-500 mt-1">{status}</p>}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function getDBRStatus(dbr: number): string {
  if (dbr <= 30) return 'Aman';
  if (dbr <= 50) return 'Cukup';
  return 'Berisiko';
}
