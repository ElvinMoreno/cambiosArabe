export interface PartialVentaBs {
  cuentaBancariaBolivares?: { id: string };
  cuentaBancariaPesos?: any;
  metodoPago?: any;
  cliente?: any;
  tasaVenta?: number;
  fechaVenta?: Date;
  referencia?: string;
  bolivaresVendidos?: number;
  precio?: number;
  comision?: number;
  nombreCuentaDestinatario?: string;
  cedula?: number;
  numeroCuenta?: number;
  banco?: string;
  entrada?: boolean;
  salida?: boolean;
}
