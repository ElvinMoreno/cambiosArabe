export interface MovimientoDiaDTO {
  fecha: string; // Puede ser string o Date, según lo necesites
  tipoMovimiento: string;
  monto: number;
  descripcion: string;
  entrada: boolean;
  nombreCuentaBancaria: string;
  saldoActual: number; // Nuevo campo agregado para reflejar la actualización en el backend
  nombreClienteFinal: String;
  tasaVenta: number;
  bolivaresVendidos: number;
}
