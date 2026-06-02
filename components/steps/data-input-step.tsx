'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/app/page';

interface DataInputStepProps {
  onSubmit: (data: FormData) => void;
}

export function DataInputStep({ onSubmit }: DataInputStepProps) {
  const [data, setData] = useState<FormData>({
    namaLengkap: '',
    jenisPekerjaan: '',
    masaKerja: '',
    prospekSektor: '',
    pendapatanBersih: 0,
    cicilanBerjalan: 0,
    asetLikuid: 0,
    totalHutang: 0,
    totalModal: 0,
    hargaProperti: 0,
    dp: 0,
    tenor: 10,
    sukuBunga: 7.5,
  });

  const calculations = useMemo(() => {
    const plafon = data.hargaProperti - data.dp;
    const monthlyRate = data.sukuBunga / 100 / 12;
    const numberOfPayments = data.tenor * 12;
    const cicilan =
      plafon *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalCicilan = data.cicilanBerjalan + cicilan;
    const dbr = (totalCicilan / data.pendapatanBersih) * 100;
    const dsr = (cicilan / data.pendapatanBersih) * 100;
    const ltv = (plafon / data.hargaProperti) * 100;
    const selfFinancing = (data.dp / data.hargaProperti) * 100;
    const der = data.totalModal > 0 ? data.totalHutang / data.totalModal : 0;

    return {
      plafon: Math.round(plafon),
      cicilan: Math.round(cicilan),
      totalCicilan: Math.round(totalCicilan),
      dbr: parseFloat(dbr.toFixed(2)),
      dsr: parseFloat(dsr.toFixed(2)),
      ltv: parseFloat(ltv.toFixed(2)),
      selfFinancing: parseFloat(selfFinancing.toFixed(2)),
      der: parseFloat(der.toFixed(2)),
    };
  }, [data]);

  const isFormValid =
    data.namaLengkap &&
    data.jenisPekerjaan &&
    data.masaKerja &&
    data.prospekSektor &&
    data.pendapatanBersih > 0 &&
    data.hargaProperti > 0 &&
    data.dp > 0 &&
    data.totalModal > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Input</h2>
        <p className="text-gray-600">Tahap 1 dari 3 - Kumpulkan semua data rawyang diperlukan</p>
      </div>

      {/* Identitas & Pekerjaan */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Identitas & Pekerjaan</h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={data.namaLengkap}
            onChange={(e) => setData({ ...data, namaLengkap: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Pekerjaan
            </label>
            <select
              value={data.jenisPekerjaan}
              onChange={(e) => setData({ ...data, jenisPekerjaan: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Pilih --</option>
              <option value="pns">Pegawai Negeri/BUMN</option>
              <option value="swasta">Pegawai Swasta Tetap</option>
              <option value="kontrak">Pegawai Kontrak</option>
              <option value="wiraswasta">Wiraswasta/Usaha Sendiri</option>
              <option value="freelance">Freelance/Tidak Tetap</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Masa Kerja / Lama Usaha
            </label>
            <select
              value={data.masaKerja}
              onChange={(e) => setData({ ...data, masaKerja: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Pilih --</option>
              <option value="5plus">&gt; 5 tahun</option>
              <option value="2to5">2 – 5 tahun</option>
              <option value="less2">&lt; 2 tahun</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Prospek Sektor Industri
          </label>
          <select
            value={data.prospekSektor}
            onChange={(e) => setData({ ...data, prospekSektor: e.target.value as any })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Pilih --</option>
            <option value="berkembang">Berkembang Pesat</option>
            <option value="stabil">Stabil</option>
            <option value="berisiko">Berisiko/Menurun</option>
          </select>
        </div>
      </div>

      {/* Keuangan */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Keuangan</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pendapatan Bersih Bulanan (Rp)
            </label>
            <input
              type="number"
              value={data.pendapatanBersih || ''}
              onChange={(e) => setData({ ...data, pendapatanBersih: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Cicilan Berjalan per Bulan (Rp)
            </label>
            <input
              type="number"
              value={data.cicilanBerjalan || ''}
              onChange={(e) => setData({ ...data, cicilanBerjalan: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Aset Likuid (Rp)
            </label>
            <input
              type="number"
              value={data.asetLikuid || ''}
              onChange={(e) => setData({ ...data, asetLikuid: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Total Hutang Saat Ini (Rp)
            </label>
            <input
              type="number"
              value={data.totalHutang || ''}
              onChange={(e) => setData({ ...data, totalHutang: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Aset/Modal Sendiri (Rp)
          </label>
          <input
            type="number"
            value={data.totalModal || ''}
            onChange={(e) => setData({ ...data, totalModal: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {/* Simulasi KPR */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Simulasi KPR</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Harga Properti (Rp)
            </label>
            <input
              type="number"
              value={data.hargaProperti || ''}
              onChange={(e) => setData({ ...data, hargaProperti: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Uang Muka / DP (Rp)
            </label>
            <input
              type="number"
              value={data.dp || ''}
              onChange={(e) => setData({ ...data, dp: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tenor Pinjaman (Tahun)
            </label>
            <select
              value={data.tenor}
              onChange={(e) => setData({ ...data, tenor: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={5}>5 tahun</option>
              <option value={10}>10 tahun</option>
              <option value={15}>15 tahun</option>
              <option value={20}>20 tahun</option>
              <option value={25}>25 tahun</option>
              <option value={30}>30 tahun</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Suku Bunga per Tahun (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.sukuBunga || ''}
              onChange={(e) => setData({ ...data, sukuBunga: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="7.5"
            />
          </div>
        </div>
      </div>

      {/* Live Calculations */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 space-y-4">
        <h3 className="font-bold text-lg text-blue-900">Perhitungan Otomatis (Live)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">Plafon Pinjaman</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {calculations.plafon.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">Cicilan KPR/Bulan</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {calculations.cicilan.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">Total Cicilan Bulanan</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {calculations.totalCicilan.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">DBR</p>
            <p className="text-lg font-bold text-gray-900">
              {calculations.dbr.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">LTV</p>
            <p className="text-lg font-bold text-gray-900">
              {calculations.ltv.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600 font-semibold">Self-Financing</p>
            <p className="text-lg font-bold text-gray-900">
              {calculations.selfFinancing.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={() => onSubmit(data)}
          disabled={!isFormValid}
          className="flex-1"
        >
          Lanjut ke Penilaian Karakter
        </Button>
      </div>
    </div>
  );
}
