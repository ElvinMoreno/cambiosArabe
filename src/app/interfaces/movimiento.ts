import { CuentaBancaria } from "./cuenta-bancaria";


export interface Movimiento {
  id: number;
  tipoMovimiento: Movimiento;
  cuentaBancaria: CuentaBancaria;
  referencia: number;
  fecha: Date;
  monto: number;
  entrada: boolean;
  // descripcion: Descripcion;
}
