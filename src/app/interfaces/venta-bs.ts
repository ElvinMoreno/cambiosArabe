import { Cliente } from './clientes';
import { CuentaBancaria } from './cuenta-bancaria';
import { MetodoPago } from './metodo-pago';

export interface VentaBs {
  id?: number;
  cuentaBancariaBolivares: CuentaBancaria;
  cuentaBancariaPesos?: CuentaBancaria;
  metodoPago: MetodoPago;
  cliente: Cliente;
  tasaVenta?: number;
  fechaVenta: Date;
  referencia?: string;
  bolivaresVendidos?: number;
  precio?: number;
  nombreCuenta?: string;
  comision?: number;
  nombreCuentaDestinatario?: string;
  cedula?: number;
  numeroCuenta?: number;
  banco?: string;
  entrada?: boolean;
  salida?: boolean;
  nombreClienteFinal?: string;
}
