import { Cliente } from "./clientes";
import { CuentaBancaria } from "./cuenta-bancaria";
import { Descripcion } from "./descripcion";
import { MetodoPago } from "./metodo-pago";

export interface VentaBs {
  id?: number;
  cuentaBancariaBolivares: CuentaBancaria;
  cuentaBancariaPesos: CuentaBancaria;
  descripcionId: Descripcion;
  metodoPagoId: MetodoPago;
  clienteId: Cliente;
  tasaVenta: number | null;
  fechaVenta: Date;
  referencia?: string;
  bolivaresVendidos?: number;
  precioVentaBs: number;
  comision?: number;
  numeroCuenta: number;
  precio?: number;
  nombreCuentaDestinatario?: string;
  cedula?: string;
  banco?: string;
  entrada: boolean;
  salida: boolean;

}
