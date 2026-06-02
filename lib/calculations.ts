// Formula PMT untuk cicilan bulanan (anuitas)
export function calculatePMT(
  principal: number,
  annualRate: number,
  yearsTenor: number
): number {
  if (principal <= 0 || yearsTenor <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = yearsTenor * 12;
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }
  
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
  
  return (principal * numerator) / denominator;
}

// Hitung plafon balik dari cicilan dan tenor
export function calculatePlafon(
  monthlyPayment: number,
  annualRate: number,
  yearsTenor: number
): number {
  if (monthlyPayment <= 0 || yearsTenor <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = yearsTenor * 12;
  
  if (monthlyRate === 0) {
    return monthlyPayment * numberOfPayments;
  }
  
  const denominator = (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  
  return (monthlyPayment * denominator) / numerator;
}

// Hitung metrik-metrik penting
export function calculateMetrics(formData: {
  hargaProperti: number;
  dp: number;
  tenor: number;
  sukuBungaFixed: number;
  sukuBungaFloating: number;
  pendapatanBersih: number;
  cicilanBerjalan: number;
  totalHutang: number;
  totalModal: number;
}) {
  const plafon = formData.hargaProperti - formData.dp;
  
  // Cicilan dengan suku bunga fixed
  const cicilanFixed = calculatePMT(
    plafon,
    formData.sukuBungaFixed,
    formData.tenor
  );
  
  // Cicilan dengan suku bunga floating (skenario konservatif)
  const cicilanFloating = calculatePMT(
    plafon,
    formData.sukuBungaFloating,
    formData.tenor
  );
  
  // Untuk scoring, gunakan cicilan floating (worst case)
  const cicilanUntukScoring = cicilanFloating;
  const totalCicilan = cicilanUntukScoring + formData.cicilanBerjalan;
  
  // Ratio calculations
  const dsr = formData.pendapatanBersih > 0 
    ? (cicilanUntukScoring / formData.pendapatanBersih) * 100
    : 0;
  
  const dbr = formData.pendapatanBersih > 0
    ? (totalCicilan / formData.pendapatanBersih) * 100
    : 0;
  
  const ltv = formData.hargaProperti > 0
    ? (plafon / formData.hargaProperti) * 100
    : 0;
  
  const selfFinancing = formData.hargaProperti > 0
    ? (formData.dp / formData.hargaProperti) * 100
    : 0;
  
  const der = formData.totalModal > 0
    ? formData.totalHutang / formData.totalModal
    : 0;
  
  return {
    plafon,
    cicilanFixed,
    cicilanFloating,
    cicilanUntukScoring,
    totalCicilan,
    dsr,
    dbr,
    ltv,
    selfFinancing,
    der,
  };
}

// Hitung rekomendasi plafon aman (35% threshold)
export function calculateRecommendedPlafon(
  pendapatanBersih: number,
  cicilanBerjalan: number,
  sukuBungaFloating: number,
  tenor: number
): { plafonAman: number; sisaKapasitas: number; cicilan: number } {
  const batasAmanCicilan = pendapatanBersih * 0.35; // 35% threshold
  const sisaKapasitas = Math.max(0, batasAmanCicilan - cicilanBerjalan);
  
  const plafonAman = calculatePlafon(
    sisaKapasitas,
    sukuBungaFloating,
    tenor
  );
  
  return {
    plafonAman,
    sisaKapasitas,
    cicilan: sisaKapasitas,
  };
}
