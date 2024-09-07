import { CuentaDestinatario } from "./cuenta-destinatario";

export interface VentaBs {
  id?: number;
  cuentaBancariaBs: number;
  cuentaBancariaPesos: number;
  descripcionId: number;
  clienteId: number;
  fechaVenta: Date;
  referencia: string;
  bolivaresVendidos?: number;
  precioVentaBs: number;
  metodoPagoId: number;
  comision: number;
  tasaVenta: number;



  nombreClienteFinal: string;

  banco: string;

  entrada: boolean;
  salida: boolean;

  cuentasDestinatario?: CuentaDestinatario[]; // Agregar esta línea
}
