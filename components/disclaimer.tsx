import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-6">
      <div className="flex gap-3">
        <AlertTriangle size={20} className="text-gray-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 leading-relaxed">
          <span className="font-semibold">Disclaimer: </span>
          Hasil penilaian ini merupakan simulasi estimasi yang dibuat untuk keperluan akademik
          (Tugas Akhir Praktikum Analisis Kredit, Prodi Perbankan Sekolah Vokasi UGM 2026).
          Hasil ini BUKAN merupakan keputusan resmi pemberian kredit dari lembaga perbankan
          manapun. Keputusan kredit sesungguhnya sepenuhnya merupakan kewenangan bank berdasarkan
          kebijakan internal dan peraturan yang berlaku.
        </div>
      </div>
    </div>
  );
}
