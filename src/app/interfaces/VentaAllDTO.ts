export interface VentaAllDTO {

  id?: number;
  cuentaCop: string;
  metodoPago: string;
  tasa: number;
  fecha: Date;
  bolivares?: number;
  pesos?: number;

}