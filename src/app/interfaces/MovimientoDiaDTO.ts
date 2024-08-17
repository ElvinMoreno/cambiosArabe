export interface MovimientoDiaDTO {
  fecha: string ;         // Puede ser string o Date, según lo necesites
  tipoMovimiento: string;
  monto: number;
  descripcion: string;
  entrada: boolean;
  nombreCuentaBancaria: string; // Ajusta el nombre para que coincida con el backend
}
