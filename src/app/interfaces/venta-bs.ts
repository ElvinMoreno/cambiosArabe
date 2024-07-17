import { Cliente } from "./clientes";
import { CuentaBancaria } from "./cuenta-bancaria";

export interface VentaBs {
  id: number;
  cuentaBancariaBolivares: CuentaBancaria;
  cuentaBancariaPesos: CuentaBancaria;
  // metodoPago: MetodoPago;
  cliente: Cliente;
  tasaVenta: number | null;
  fechaVenta: Date;
  referencia: string;
  bolivaresVendidos: number;
  precio: number;
  comision: number;
}
