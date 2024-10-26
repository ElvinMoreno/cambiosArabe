import { Cliente } from "./clientes";
import { CuentaBancaria } from "./cuenta-bancaria";
import { CuentaDestinatario } from "./cuenta-destinatario";
import { VentaBsCuentaBancaria } from "./VentaBsCuentaBancaria";

export interface VentaBs {
  id?: number;


  cuentaBancariaBolivares?: CuentaBancaria;

  cuentasBancariasPesos?: VentaBsCuentaBancaria[];


  cliente?: Cliente;

  tasaVenta: number;
  cuentaBancariaBs: number;
  cuentaBancariaPesos: number;
  descripcionId: number;
  clienteId: number;
  fechaVenta: Date;
  referencia: string;
  bolivaresVendidos?: number;
  precioVentaBs: number;
  comision: number;

  precio?: number;


  nombreClienteFinal: string;

  banco: string;

  entrada: boolean;
  salida: boolean;

  cuentasDestinatario?: CuentaDestinatario[]; // Agregar esta línea

}
