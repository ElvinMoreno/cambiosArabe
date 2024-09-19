export interface MovimientoDiaDTO {
  id: number;
  fecha: string; // Puede ser string o Date, según lo necesites
  tipoMovimiento: string;
  monto: number;
  descripcion: string;
  entrada: boolean;
  nombreCuentaBancaria: string;
  saldoActual: number; // Nuevo campo agregado para reflejar la actualización en el backend
<<<<<<< HEAD
  nombreClienteFinal: string; // Nuevo campo
=======
  nombreClienteFinal: String;
  tasaVenta: number;
  bolivaresVendidos: number;
>>>>>>> 0c932a20ff9f47c55f2f5a2258db088c8eefc214
}
