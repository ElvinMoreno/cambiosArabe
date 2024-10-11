import { CuentaBancaria } from "./cuenta-bancaria";
import { MetodoPago } from './metodo-pago';

export interface VentaBsCuentaBancaria {

  cuentaBancaria: CuentaBancaria;
  monto: number;
  confirmado?: boolean;
  metodoPagoId: number | MetodoPago;
}
