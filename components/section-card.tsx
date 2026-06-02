'use client';

interface SectionCardProps {
  children: React.ReactNode;
}

export function SectionCard({ children }: SectionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {children}
    </div>
  );
}
