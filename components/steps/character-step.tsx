'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormData } from '@/app/page';

interface CharacterStepProps {
  formData: FormData;
  onSubmit: (data: FormData) => void;
  onBack: () => void;
}

type CharacterKey = 'hubunganBank' | 'riwayatKredit' | 'kedisiplinan' | 'reputasi' | 'stabilitasTinggal' | 'catatanHukum' | 'legalitasJaminan' | 'likuiditasJaminan';

export function CharacterStep({ formData, onSubmit, onBack }: CharacterStepProps) {
  const [data, setData] = useState<FormData>(formData);

  const characterGroups: { key: CharacterKey; title: string; options: { label: string; value: any }[] }[] = [
    {
      key: 'hubunganBank',
      title: 'Hubungan dengan Bank',
      options: [
        { label: 'Pernah pinjaman lunas', value: 'lunas' },
        { label: 'Sedang punya pinjaman lancar', value: 'lancar' },
        { label: 'Hanya punya tabungan', value: 'tabungan' },
        { label: 'Nasabah baru', value: 'baru' },
      ],
    },
    {
      key: 'riwayatKredit',
      title: 'Riwayat Kredit (SLIK/BI Checking)',
      options: [
        { label: 'Kolektibilitas 1 — Lancar', value: 'kol1' },
        { label: 'Kolektibilitas 2 — Dalam Perhatian Khusus', value: 'kol2' },
        { label: 'Kolektibilitas 3–5 — Kurang Lancar hingga Macet', value: 'kol35' },
      ],
    },
    {
      key: 'kedisiplinan',
      title: 'Kedisiplinan Pembayaran',
      options: [
        { label: 'Selalu tepat waktu', value: 'tepat' },
        { label: 'Kadang terlambat', value: 'kadang' },
        { label: 'Sering terlambat / menunggak', value: 'sering' },
      ],
    },
    {
      key: 'reputasi',
      title: 'Reputasi & Kepribadian Nasabah',
      options: [
        { label: 'Sangat baik (jujur, kooperatif, komunikatif)', value: 'sangat' },
        { label: 'Cukup baik', value: 'cukup' },
        { label: 'Kurang baik / tidak kooperatif', value: 'kurang' },
      ],
    },
    {
      key: 'stabilitasTinggal',
      title: 'Stabilitas Tempat Tinggal',
      options: [
        { label: 'Tinggal tetap > 3 tahun', value: 'plus3' },
        { label: 'Tinggal 1–3 tahun', value: '1to3' },
        { label: '< 1 tahun / sering pindah', value: 'less1' },
      ],
    },
    {
      key: 'catatanHukum',
      title: 'Catatan Hukum / Masalah Keuangan',
      options: [
        { label: 'Tidak pernah bermasalah', value: 'bersih' },
        { label: 'Pernah masalah ringan', value: 'ringan' },
        { label: 'Masalah serius / kredit macet', value: 'serius' },
      ],
    },
    {
      key: 'legalitasJaminan',
      title: 'Legalitas Jaminan (Sertifikat Properti)',
      options: [
        { label: 'SHM atas nama sendiri', value: 'shm' },
        { label: 'SHGB / atas nama orang lain (ada surat kuasa)', value: 'shgb' },
        { label: 'Dokumen tidak lengkap / dalam sengketa', value: 'tidak' },
      ],
    },
    {
      key: 'likuiditasJaminan',
      title: 'Likuiditas Jaminan (Kemudahan Dijual)',
      options: [
        { label: 'Sangat likuid (properti lokasi strategis pusat kota)', value: 'sangat' },
        { label: 'Cukup likuid (perumahan berkembang)', value: 'cukup' },
        { label: 'Sulit dilikuidasi (lokasi terpencil)', value: 'sulit' },
      ],
    },
  ];

  const isFormValid = characterGroups.every((group) => data[group.key]);

  const RadioOption = ({
    label,
    value,
    selected,
    onChange,
  }: {
    label: string;
    value: any;
    selected: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`w-full text-left p-4 border-2 rounded-lg transition ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
            selected
              ? 'border-blue-600 bg-blue-600'
              : 'border-gray-300 bg-white'
          }`}
        >
          {selected && <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">✓</div>}
        </div>
        <span className="font-medium text-gray-900">{label}</span>
      </div>
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Penilaian Karakter</h2>
        <p className="text-gray-600">Tahap 2 dari 3 - Pilih opsi yang sesuai dengan kondisi nasabah</p>
      </div>

      {characterGroups.map((group) => (
        <div key={group.key} className="border rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg text-gray-900">{group.title}</h3>
          <div className="space-y-2">
            {group.options.map((option) => (
              <RadioOption
                key={option.value}
                label={option.label}
                value={option.value}
                selected={data[group.key] === option.value}
                onChange={() => setData({ ...data, [group.key]: option.value })}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={onBack} className="w-32">
          Kembali
        </Button>
        <Button
          onClick={() => onSubmit(data)}
          disabled={!isFormValid}
          className="flex-1"
        >
          Lanjut ke Proses Scoring
        </Button>
      </div>
    </div>
  );
}
