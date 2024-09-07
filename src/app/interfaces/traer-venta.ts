import { CuentaBancaria } from "./cuenta-bancaria";
import { MetodoPago } from './metodo-pago';

export interface TraerVenta {
  cuentaBancariaPesos: CuentaBancaria;
  metodoPago: MetodoPago;
  tasaVenta: number;
  bolivaresVendidos: number;
  precio: number;
}
