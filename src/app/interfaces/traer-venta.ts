import { CuentaBancaria } from "./cuenta-bancaria";
import { MetodoPago } from './metodo-pago';

export interface TraerVenta {
  cuentaBancariaPesos: CuentaBancaria;
  tasaVenta: number;
  bolivaresVendidos: number;
  precio: number;
}
