import { CuentaBancaria } from "./cuenta-bancaria";

export interface Retiro {
  cuentaBancariaSalidaId: number;
  cuentaBancariaEntradaId: number | null;
  metodoPagoId: number;
  descripcionId: number;
  monto: number;
  fechaRetiro?: string;
  cuentaBancaria?: CuentaBancaria
}
