export interface MovimientoDiaDTO {
  cuentaBancaria: string;  // Nombre de la cuenta bancaria
  hora: string;
  tipoMovimiento: string;
  monto: number;
  descripcion: string;
  entrada: boolean;
}
