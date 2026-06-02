'use client';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const steps = [
    { number: 1, label: 'Data Input', description: 'Kumpulkan data finansial dan KPR' },
    { number: 2, label: 'Penilaian Karakter', description: 'Pilih kondisi nasabah' },
    { number: 3, label: 'Proses Scoring', description: 'Hitung skor 5C' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.number}
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">
                {step.label}
              </p>
              <p className="text-xs text-gray-600 text-center max-w-[120px]">
                {step.description}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
