'use client';

import { Button } from '@/components/ui/button';
import { FormData, ScoringResult } from '@/app/page';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ResultStepProps {
  formData: FormData;
  result: ScoringResult;
  onReset: () => void;
}

export function ResultStep({ formData, result, onReset }: ResultStepProps) {
  const decisionConfig = {
    approved: {
      label: 'LAYAK DISETUJUI',
      color: 'bg-green-100 border-green-300',
      textColor: 'text-green-900',
      badgeColor: 'bg-green-500',
      icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
      description: 'Aplikasi Anda telah disetujui berdasarkan penilaian 5C.',
    },
    considered: {
      label: 'DIPERTIMBANGKAN',
      color: 'bg-yellow-100 border-yellow-300',
      textColor: 'text-yellow-900',
      badgeColor: 'bg-yellow-500',
      icon: <AlertCircle className="w-8 h-8 text-yellow-600" />,
      description: 'Perlu analisis tambahan sebelum pengambilan keputusan final.',
    },
    risky: {
      label: 'RISIKO TINGGI',
      color: 'bg-orange-100 border-orange-300',
      textColor: 'text-orange-900',
      badgeColor: 'bg-orange-500',
      icon: <AlertCircle className="w-8 h-8 text-orange-600" />,
      description: 'Penilaian menunjukkan risiko tinggi. Syarat khusus mungkin diperlukan.',
    },
    rejected: {
      label: 'DITOLAK',
      color: 'bg-red-100 border-red-300',
      textColor: 'text-red-900',
      badgeColor: 'bg-red-500',
      icon: <XCircle className="w-8 h-8 text-red-600" />,
      description: result.dbr > 50 
        ? 'Aplikasi ditolak karena beban cicilan melebihi 50% dari pendapatan.'
        : 'Penilaian kelayakan tidak memenuhi standar minimum yang ditetapkan.',
    },
  };

  const config = decisionConfig[result.decision];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Hasil Penilaian</h2>
        <p className="text-gray-600">Penilaian kelayakan kredit KPR selesai</p>
      </div>

      {/* DBR Summary */}
      <div className={`border-2 rounded-lg p-6 space-y-3 ${config.color}`}>
        <div className="flex items-center gap-3">
          {config.icon}
          <h3 className={`font-bold text-lg ${config.textColor}`}>
            DBR (Debt to Income Ratio)
          </h3>
        </div>
        <p className={`text-3xl font-bold ${config.textColor}`}>
          {result.dbr.toFixed(1)}%
        </p>
        <p className={`text-sm ${config.textColor}`}>
          {result.dbr <= 30 && 'Status: Sangat Baik'}
          {result.dbr > 30 && result.dbr <= 40 && 'Status: Masih Layak'}
          {result.dbr > 40 && result.dbr <= 50 && 'Status: Risiko Tinggi'}
          {result.dbr > 50 && 'Status: DITOLAK'}
        </p>
      </div>

      {/* KPR Simulation Summary */}
      {result.dbr <= 50 && (
        <div className="border rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg text-gray-900">Ringkasan Simulasi KPR</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">Harga Properti</p>
              <p className="font-bold text-gray-900">
                Rp {formData.hargaProperti.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">DP</p>
              <p className="font-bold text-gray-900">
                Rp {formData.dp.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">Plafon</p>
              <p className="font-bold text-gray-900">
                Rp {(formData.hargaProperti - formData.dp).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">LTV</p>
              <p className="font-bold text-gray-900">{result.ltv.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Score Breakdown */}
      {result.dbr <= 50 && (
        <div className="border rounded-lg p-6 space-y-6">
          <h3 className="font-bold text-lg text-gray-900">Breakdown Skor 5C</h3>

          <ScoreBar label="Character (Karakter)" score={result.character} max={30} />
          <ScoreBar label="Capacity (Kapasitas)" score={result.capacity} max={20} />
          <ScoreBar label="Capital (Modal)" score={result.capital} max={20} />
          <ScoreBar label="Collateral (Jaminan)" score={result.collateral} max={20} />
          <ScoreBar label="Condition (Kondisi)" score={result.condition} max={10} />

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">TOTAL SKOR</span>
              <span className="text-3xl font-bold text-blue-600">
                {result.total} / 100
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Decision */}
      <div className={`border-2 rounded-lg p-6 space-y-3 ${config.color}`}>
        <div className="flex items-center gap-3">
          {config.icon}
          <h3 className={`font-bold text-xl ${config.textColor}`}>
            {config.label}
          </h3>
        </div>
        <p className={`${config.textColor}`}>{config.description}</p>
      </div>

      {/* Financial Metrics */}
      {result.dbr <= 50 && (
        <div className="border rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-lg text-gray-900">Metrik Keuangan Detail</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">DSR</p>
              <p className="font-bold text-gray-900">{result.dsr.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">Self-Financing</p>
              <p className="font-bold text-gray-900">{result.selfFinancing.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">DER</p>
              <p className="font-bold text-gray-900">{result.der.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-600 font-semibold">Tenor</p>
              <p className="font-bold text-gray-900">{formData.tenor} tahun</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button onClick={onReset} className="flex-1">
          Mulai Penilaian Baru
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Cetak
        </Button>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  max,
}: {
  label: string;
  score: number;
  max: number;
}) {
  const percentage = (score / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">
          {score} / {max}
        </span>
      </div>
      <Progress value={percentage} className="h-3" />
    </div>
  );
}
