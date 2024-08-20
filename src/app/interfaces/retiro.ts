import { CuentaBancaria } from "./cuenta-bancaria";

export interface Retiro {
  cuentaBancariaSalidaId: number;
  cuentaBancariaEntradaId: number | null;
  metodoPagoId: number;
  descripcionId?: number | null;
  proveedorId?: number | null;  // Cambiado para permitir null o undefined
  gastoId?: number | null;        // Agregado para el caso de "Gasto"
  monto: number;
  fechaRetiro?: Date;
  cuentaBancaria?: CuentaBancaria;
}

