import { TipoCuentaBancaria } from "./tipo-cuenta-bancaria";

export interface CuentaBancaria {
  id: number;
  tipocuenta: TipoCuentaBancaria;
  nombreBanco: string | null;
  nombreCuenta: string | null;
  monto: number | null;
  numCuenta: number | null;
  limiteCB: number | null;
  limiteMonto: number | null;

}
