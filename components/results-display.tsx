'use client';

interface ScoreItem {
  label: string;
  score: number;
  maxScore: number;
  details?: string[];
}

interface ResultsDisplayProps {
  scores: ScoreItem[];
  totalScore: number;
  maxTotalScore: number;
  decision: string;
  decisionColor: string;
  dbr?: number;
  dsr?: number;
  ltv?: number;
  der?: number;
}

export function ResultsDisplay({
  decision,
  decisionColor,
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Decision Card Only */}
      <div className={`${decisionColor} text-white rounded-lg p-8`}>
        <h3 className="text-lg font-semibold mb-4 text-center">Hasil Penilaian</h3>
        <div className="text-center">
          <p className="text-3xl font-bold">{decision}</p>
        </div>
      </div>
    </div>
  );
}
