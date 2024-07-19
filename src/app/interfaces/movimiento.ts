import { CuentaBancaria } from "./cuenta-bancaria";
import { Descripcion } from "./descripcion";


export interface Movimiento {
  id: number;
  tipoMovimiento: Movimiento;
  cuentaBancaria: CuentaBancaria;
  referencia: number;
  fecha: Date;
  monto: number;
  entrada: boolean;
  descripcion: Descripcion;
}
