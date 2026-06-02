'use client';

interface SectionHeaderProps {
  number: number;
  title: string;
  description?: string;
}

export function SectionHeader({ number, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {description && <p className="text-sm text-gray-600 ml-11">{description}</p>}
    </div>
  );
}
