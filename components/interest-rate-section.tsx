'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Info } from 'lucide-react';

interface InterestRateProps {
  tipeBunga: 'fixed' | 'berjenjang' | 'floating' | '';
  sukuBunga: number | '';
  tenor: number | '';
  berjenjangData?: Array<{ tahunAwal: number; tahunAkhir: number; rate: number }>;
  floatingData?: { rateAwal: number; ceiling: number; floor: number; spreadAwal: number };
  onTipeChange: (tipe: 'fixed' | 'berjenjang' | 'floating') => void;
  onRateChange: (rate: number) => void;
  onBerjenjangChange?: (data: Array<{ tahunAwal: number; tahunAkhir: number; rate: number }>) => void;
  onFloatingChange?: (data: { rateAwal: number; ceiling: number; floor: number; spreadAwal: number }) => void;
}

export function InterestRateSection({
  tipeBunga,
  sukuBunga,
  tenor,
  berjenjangData = [],
  floatingData = { rateAwal: 0, ceiling: 0, floor: 0, spreadAwal: 0 },
  onTipeChange,
  onRateChange,
  onBerjenjangChange,
  onFloatingChange,
}: InterestRateProps) {
  const [localBerjenjang, setLocalBerjenjang] = useState(
    berjenjangData.length > 0
      ? berjenjangData
      : [{ tahunAwal: 1, tahunAkhir: 5, rate: 4.75 }]
  );
  
  const [localFloating, setLocalFloating] = useState(
    floatingData.rateAwal > 0
      ? floatingData
      : { rateAwal: 4.5, ceiling: 7.0, floor: 3.5, spreadAwal: 2.0 }
  );

  // Auto-calculate weighted average for tiered rates display
  const weightedAverageRate = useMemo(() => {
    if (localBerjenjang.length === 0 || !tenor) return 0;
    const tenorNum = typeof tenor === 'number' ? tenor : 0;
    let totalWeightedRate = 0;
    let totalMonths = 0;

    localBerjenjang.forEach((tier) => {
      const startMonth = (tier.tahunAwal - 1) * 12;
      const endMonth = Math.min(tier.tahunAkhir * 12, tenorNum * 12);
      const months = Math.max(0, endMonth - startMonth);
      totalWeightedRate += tier.rate * months;
      totalMonths += months;
    });

    return totalMonths > 0 ? totalWeightedRate / totalMonths : 0;
  }, [localBerjenjang, tenor]);

  const handleAddTier = () => {
    const lastTier = localBerjenjang[localBerjenjang.length - 1];
    const newTahunAwal = lastTier.tahunAkhir + 1;
    const newTahunAkhir = newTahunAwal + 4;
    
    setLocalBerjenjang([
      ...localBerjenjang,
      { tahunAwal: newTahunAwal, tahunAkhir: newTahunAkhir, rate: 5.5 }
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (localBerjenjang.length > 1) {
      const updated = localBerjenjang.filter((_, i) => i !== index);
      setLocalBerjenjang(updated);
      onBerjenjangChange?.(updated);
    }
  };

  const handleTierChange = (index: number, field: 'tahunAwal' | 'tahunAkhir' | 'rate', value: number) => {
    const updated = [...localBerjenjang];
    updated[index] = { ...updated[index], [field]: value };
    setLocalBerjenjang(updated);
    onBerjenjangChange?.(updated);
  };

  const handleFloatingChange = (field: keyof typeof localFloating, value: number) => {
    const updated = { ...localFloating, [field]: value };
    setLocalFloating(updated);
    onFloatingChange?.(updated);
  };

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Pilihan Suku Bunga (Rate)</h3>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Pilih jenis suku bunga yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      <Tabs value={tipeBunga || 'fixed'} onValueChange={(v) => onTipeChange(v as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="fixed">Tetap (Fixed)</TabsTrigger>
          <TabsTrigger value="berjenjang">Berjenjang</TabsTrigger>
          <TabsTrigger value="floating">Mengambang (Floating)</TabsTrigger>
        </TabsList>

        {/* FIXED RATE */}
        <TabsContent value="fixed" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Suku bunga tetap:</strong> Bunga tidak berubah selama masa pinjaman. 
              Cicilan Anda stabil dan mudah direncanakan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Suku Bunga per Tahun (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={sukuBunga || ''}
                onChange={(e) => onRateChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                placeholder="7.5"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tenor (Tahun)
              </label>
              <input
                type="number"
                value={tenor || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-900"
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-green-900">
              <strong>Cicilan bulanan tetap:</strong> Rp{' '}
              {tenor && sukuBunga
                ? (
                    ((tenor as number) * 12 * (sukuBunga as number) * 1000000) /
                    ((tenor as number) * 12)
                  )
                    .toLocaleString('id-ID')
                : '0'}
              {' '} (perkiraan untuk pinjaman Rp 1 miliar)
            </p>
          </div>
        </TabsContent>

        {/* TIERED RATE */}
        <TabsContent value="berjenjang" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Suku bunga berjenjang:</strong> Bunga berubah sesuai dengan tahapan pinjaman. 
              Biasanya lebih rendah di awal, kemudian naik setelahnya.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-900">Tahapan Suku Bunga</h4>
              <Button
                onClick={handleAddTier}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah Tahap
              </Button>
            </div>

            {localBerjenjang.map((tier, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h5 className="font-semibold text-gray-900">Tahap {index + 1}</h5>
                  {localBerjenjang.length > 1 && (
                    <button
                      onClick={() => handleRemoveTier(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Dari Tahun
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tier.tahunAwal}
                      onChange={(e) =>
                        handleTierChange(index, 'tahunAwal', parseInt(e.target.value) || 1)
                      }
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Hingga Tahun
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={tier.tahunAkhir}
                      onChange={(e) =>
                        handleTierChange(index, 'tahunAkhir', parseInt(e.target.value) || 1)
                      }
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                      Suku Bunga (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={tier.rate}
                      onChange={(e) =>
                        handleTierChange(index, 'rate', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-2 py-2 border border-gray-300 rounded bg-white text-gray-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 mb-2">
              <strong>Rata-rata suku bunga (weighted):</strong> {weightedAverageRate.toFixed(2)}%
            </p>
            <p className="text-xs text-green-800">
              Ini adalah rata-rata suku bunga Anda selama seluruh periode tenor berdasarkan tahapan yang ditetapkan.
            </p>
          </div>
        </TabsContent>

        {/* FLOATING RATE */}
        <TabsContent value="floating" className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Suku bunga mengambang:</strong> Bunga mengikuti perubahan pasar (interest rate acuan/BI Rate).
              Memiliki batasan minimal (floor) dan maksimal (ceiling).
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Suku Bunga Awal (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={localFloating.rateAwal}
                  onChange={(e) =>
                    handleFloatingChange('rateAwal', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  placeholder="4.5"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Spread Awal (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={localFloating.spreadAwal}
                  onChange={(e) =>
                    handleFloatingChange('spreadAwal', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  placeholder="2.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Suku Bunga Minimum / Floor (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={localFloating.floor}
                  onChange={(e) =>
                    handleFloatingChange('floor', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  placeholder="3.5"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Suku Bunga Maksimum / Ceiling (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={localFloating.ceiling}
                  onChange={(e) =>
                    handleFloatingChange('ceiling', parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900"
                  placeholder="7.0"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900 mb-2">
              <strong>Perkiraan rentang suku bunga:</strong> {localFloating.floor.toFixed(2)}% - {localFloating.ceiling.toFixed(2)}%
            </p>
            <p className="text-xs text-yellow-800">
              Suku bunga Anda bisa bergerak di antara batasan ini tergantung kondisi pasar dan kebijakan BI Rate.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-900 mb-2">
              <strong>Catatan:</strong> Suku bunga mengambang lebih berisiko karena cicilan bisa berubah setiap periode review. 
              Namun, awal pinjaman biasanya lebih murah dibanding fixed rate.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-700">
          <strong>Tipe Suku Bunga Dipilih:</strong>{' '}
          <span className="text-blue-900 font-semibold">
            {tipeBunga === 'fixed'
              ? 'Tetap'
              : tipeBunga === 'berjenjang'
              ? 'Berjenjang'
              : tipeBunga === 'floating'
              ? 'Mengambang'
              : 'Belum dipilih'}
          </span>
        </p>
      </div>
    </Card>
  );
}
