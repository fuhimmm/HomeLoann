'use client';

interface RadioOption {
  label: string;
  value: string;
  description?: string;
  score?: number;
}

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  showScore?: boolean;
}

export function RadioGroup({
  label,
  value,
  onChange,
  options,
  required = false,
  showScore = false,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
              value === option.value
                ? 'border-blue-900 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 cursor-pointer accent-blue-900"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{option.label}</p>
              {option.description && (
                <p className="text-xs text-gray-600 mt-1">{option.description}</p>
              )}
            </div>
            {showScore && option.score !== undefined && (
              <span className="text-sm font-bold text-blue-900 bg-blue-100 px-2 py-1 rounded whitespace-nowrap">
                {option.score} poin
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
