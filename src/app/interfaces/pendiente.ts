import { CuentaBancaria } from "./cuenta-bancaria";

export interface Pendiente {
  id?: number;
  cuentaBancaria:CuentaBancaria;
  monto: number

}
