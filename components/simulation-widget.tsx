import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculatePMT } from '@/lib/calculations';

interface SimulationWidgetProps {
  hargaProperti: number;
  dp: number;
  tenor: number;
  sukuBungaFloating: number;
  pendapatanBersih: number;
  cicilanBerjalan: number;
  totalScore: number;
}

export function SimulationWidget({
  hargaProperti,
  dp,
  tenor,
  sukuBungaFloating,
  pendapatanBersih,
  cicilanBerjalan,
  totalScore,
}: SimulationWidgetProps) {
  const [activeScenario, setActiveScenario] = useState<'dp' | 'cicilan' | 'tenor' | null>(null);
  const [dpSlider, setDpSlider] = useState(dp);
  const [cicilanSlider, setCicilanSlider] = useState(cicilanBerjalan);
  const [tenorSlider, setTenorSlider] = useState(tenor);

  const plafon = hargaProperti - dp;

  // Scenario A: Naikkan DP
  const scenarioAPlafon = hargaProperti - dpSlider;
  const scenarioACicilan = calculatePMT(scenarioAPlafon, sukuBungaFloating, tenor);
  const scenarioALTV = (scenarioAPlafon / hargaProperti) * 100;
  const scenarioACollateralScore = calculateScenarioCollateralScore(
    scenarioAPlafon,
    scenarioACicilan
  );

  // Scenario B: Kurangi hutang berjalan
  const scenarioBTotalCicilan = scenarioACicilan + cicilanSlider;
  const scenarioDBR = (scenarioBTotalCicilan / pendapatanBersih) * 100;
  const scenarioBCapacityScore = calculateScenarioCapacityScore(
    scenarioDBR,
    pendapatanBersih
  );

  // Scenario C: Perpanjang tenor
  const scenarioCCicilan = calculatePMT(plafon, sukuBungaFloating, tenorSlider);
  const scenarioCDSR = (scenarioCCicilan / pendapatanBersih) * 100;
  const scenarioCCapacityScore = calculateScenarioCapacityScore(
    scenarioCDSR,
    pendapatanBersih
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Simulasi Perbaikan Skor</h3>

      {/* Scenario A */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <button
          onClick={() => setActiveScenario(activeScenario === 'dp' ? null : 'dp')}
          className="w-full text-left font-semibold text-blue-900 hover:text-blue-700 transition flex justify-between items-center"
        >
          <span>Skenario A: Naikkan Uang Muka</span>
          <span className="text-sm">{activeScenario === 'dp' ? '▼' : '▶'}</span>
        </button>

        {activeScenario === 'dp' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uang Muka: Rp {dpSlider.toLocaleString('id-ID')}
              </label>
              <input
                type="range"
                min={dp}
                max={hargaProperti * 0.5}
                value={dpSlider}
                onChange={(e) => setDpSlider(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p>
                  LTV turun menjadi <span className="font-semibold">{scenarioALTV.toFixed(1)}%</span>
                </p>
                <p>
                  Skor Collateral naik <span className="font-semibold">+{Math.max(0, scenarioACollateralScore - 7)} poin</span>
                </p>
                <p>
                  Total skor menjadi{' '}
                  <span className="font-semibold text-green-600">
                    {totalScore + Math.max(0, scenarioACollateralScore - 7)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Scenario B */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <button
          onClick={() => setActiveScenario(activeScenario === 'cicilan' ? null : 'cicilan')}
          className="w-full text-left font-semibold text-purple-900 hover:text-purple-700 transition flex justify-between items-center"
        >
          <span>Skenario B: Kurangi Cicilan Berjalan</span>
          <span className="text-sm">{activeScenario === 'cicilan' ? '▼' : '▶'}</span>
        </button>

        {activeScenario === 'cicilan' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cicilan Berjalan: Rp {cicilanSlider.toLocaleString('id-ID')}
              </label>
              <input
                type="range"
                min={0}
                max={cicilanBerjalan}
                value={cicilanSlider}
                onChange={(e) => setCicilanSlider(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p>
                  DBR turun menjadi <span className="font-semibold">{scenarioDBR.toFixed(1)}%</span>
                </p>
                <p>
                  Skor Capacity naik <span className="font-semibold">+{Math.max(0, scenarioBCapacityScore - 5)} poin</span>
                </p>
                <p>
                  Total skor menjadi{' '}
                  <span className="font-semibold text-green-600">
                    {totalScore + Math.max(0, scenarioBCapacityScore - 5)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Scenario C */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <button
          onClick={() => setActiveScenario(activeScenario === 'tenor' ? null : 'tenor')}
          className="w-full text-left font-semibold text-amber-900 hover:text-amber-700 transition flex justify-between items-center"
        >
          <span>Skenario C: Perpanjang Tenor</span>
          <span className="text-sm">{activeScenario === 'tenor' ? '▼' : '▶'}</span>
        </button>

        {activeScenario === 'tenor' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenor: {tenorSlider} tahun
              </label>
              <input
                type="range"
                min={tenor}
                max={30}
                value={tenorSlider}
                onChange={(e) => setTenorSlider(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <p>
                  Cicilan turun menjadi{' '}
                  <span className="font-semibold">
                    Rp {scenarioCCicilan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                  </span>
                </p>
                <p>
                  DSR turun menjadi <span className="font-semibold">{scenarioCDSR.toFixed(1)}%</span>
                </p>
                <p>
                  Skor Capacity naik <span className="font-semibold">+{Math.max(0, scenarioCCapacityScore - 5)} poin</span>
                </p>
                <p>
                  Total skor menjadi{' '}
                  <span className="font-semibold text-green-600">
                    {totalScore + Math.max(0, scenarioCCapacityScore - 5)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function calculateScenarioCollateralScore(plafon: number, cicilan: number): number {
  // Simplified collateral scoring based on LTV
  const ltv = (plafon / (plafon + plafon * 0.3)) * 100;
  if (ltv < 80) return 10;
  if (ltv <= 100) return 7;
  return 3;
}

function calculateScenarioCapacityScore(dsr: number, pendapatan: number): number {
  // Simplified capacity scoring based on DSR
  if (dsr < 30) return 10;
  if (dsr <= 50) return 7;
  return 3;
}
