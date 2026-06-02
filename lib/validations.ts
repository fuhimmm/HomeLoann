export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export function validateKPRForm(formData: {
  hargaProperti: number;
  dp: number;
  tenor: number;
  sukuBungaFixed: number;
  sukuBungaFloating: number;
  pendapatanBersih: number;
  cicilanBerjalan: number;
  asetLikuid: number;
  totalHutang: number;
  totalModal: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // DP validation
  if (formData.dp >= formData.hargaProperti) {
    errors.push({
      field: 'dp',
      message: 'Uang muka tidak boleh melebihi atau sama dengan harga properti.',
      type: 'error',
    });
  }

  // Tenor validation
  if (formData.tenor <= 0 || !formData.tenor) {
    errors.push({
      field: 'tenor',
      message: 'Tenor harus diisi dan lebih dari 0.',
      type: 'error',
    });
  }

  // Suku bunga validation
  if (formData.sukuBungaFixed <= 0) {
    errors.push({
      field: 'sukuBungaFixed',
      message: 'Suku bunga tidak boleh 0%.',
      type: 'error',
    });
  }

  if (formData.sukuBungaFloating <= 0) {
    errors.push({
      field: 'sukuBungaFloating',
      message: 'Suku bunga floating tidak boleh 0%.',
      type: 'error',
    });
  }

  // Harga properti warning
  if (formData.hargaProperti < 50000000) {
    errors.push({
      field: 'hargaProperti',
      message: 'Harga properti tampak sangat rendah. Pastikan angka sudah benar.',
      type: 'warning',
    });
  }

  // Plafon warning
  const plafon = formData.hargaProperti - formData.dp;
  if (plafon < 10000000) {
    errors.push({
      field: 'plafon',
      message: 'Plafon terlalu kecil untuk KPR. Periksa kembali DP dan harga properti.',
      type: 'warning',
    });
  }

  // Cicilan berjalan warning
  if (formData.pendapatanBersih > 0) {
    const cicilanRatio = (formData.cicilanBerjalan / formData.pendapatanBersih) * 100;
    if (cicilanRatio > 80) {
      errors.push({
        field: 'cicilanBerjalan',
        message: 'Cicilan berjalan sudah sangat tinggi. DBR kemungkinan tidak lolos.',
        type: 'warning',
      });
    }
  }

  // Negative values validation
  if (formData.asetLikuid < 0) {
    errors.push({
      field: 'asetLikuid',
      message: 'Nilai aset likuid tidak boleh negatif.',
      type: 'error',
    });
  }

  if (formData.totalHutang < 0) {
    errors.push({
      field: 'totalHutang',
      message: 'Total hutang tidak boleh negatif.',
      type: 'error',
    });
  }

  if (formData.totalModal < 0) {
    errors.push({
      field: 'totalModal',
      message: 'Total modal tidak boleh negatif.',
      type: 'error',
    });
  }

  return errors;
}

export function hasBlockingErrors(errors: ValidationError[]): boolean {
  return errors.some((e) => e.type === 'error');
}
