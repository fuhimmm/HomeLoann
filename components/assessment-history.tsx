import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ChevronDown } from 'lucide-react';

interface HistoryEntry {
  id: string;
  nama: string;
  tanggal: string;
  dbr: number;
  totalSkor: number;
  keputusan: 'Layak' | 'Dipertimbangkan' | 'Risiko Tinggi' | 'Ditolak';
  plafonDiajukan: number;
  plafonAman: number;
  skorPerPilar: {
    character: number;
    capacity: number;
    capital: number;
    collateral: number;
    condition: number;
  };
}

export function AssessmentHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kpr_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const deleteEntry = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('kpr_history', JSON.stringify(updated));
  };

  const deleteAll = () => {
    if (confirm('Hapus semua riwayat assessment? Tindakan ini tidak dapat diurungkan.')) {
      setHistory([]);
      localStorage.removeItem('kpr_history');
    }
  };

  const getDecisionColor = (keputusan: string) => {
    switch (keputusan) {
      case 'Layak':
        return 'bg-green-100 text-green-800';
      case 'Dipertimbangkan':
        return 'bg-yellow-100 text-yellow-800';
      case 'Risiko Tinggi':
        return 'bg-orange-100 text-orange-800';
      case 'Ditolak':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Belum ada riwayat assessment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Riwayat Assessment</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={deleteAll}
          className="text-xs"
        >
          Hapus Semua
        </Button>
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
        ℹ️ Riwayat disimpan di browser lokal dan akan hilang jika cache dibersihkan.
      </div>

      <div className="space-y-2">
        {history.map((entry) => (
          <Card key={entry.id} className="overflow-hidden">
            <div
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{entry.nama}</h4>
                  <p className="text-xs text-gray-500 mt-1">{entry.tanggal}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{entry.totalSkor.toFixed(0)} poin</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getDecisionColor(entry.keputusan)}`}>
                      {entry.keputusan}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(expandedId === entry.id ? null : entry.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition ${expandedId === entry.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(entry.id);
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {expandedId === entry.id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">DBR</p>
                    <p className="font-semibold text-gray-900">{entry.dbr.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Plafon Diajukan</p>
                    <p className="font-semibold text-gray-900">
                      Rp {entry.plafonDiajukan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Skor Per Pilar</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Character</span>
                      <span className="font-semibold">{entry.skorPerPilar.character} poin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity</span>
                      <span className="font-semibold">{entry.skorPerPilar.capacity} poin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Capital</span>
                      <span className="font-semibold">{entry.skorPerPilar.capital} poin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collateral</span>
                      <span className="font-semibold">{entry.skorPerPilar.collateral} poin</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Condition</span>
                      <span className="font-semibold">{entry.skorPerPilar.condition} poin</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
