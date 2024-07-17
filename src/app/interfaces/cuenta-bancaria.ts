import { Movimiento } from "./movimiento";
import { Compra } from "./proveedor";
import { TipoCuentaBancaria } from "./tipo-cuenta-bancaria";
import { VentaBs } from "./venta-bs";

export interface CuentaBancaria {
  id: number;
  tipocuenta: TipoCuentaBancaria;
  nombreBanco: string | null;
  nombreCuenta: string | null;
  monto: number | null;
  numCuenta: number | null;
  cupos: number | null;
  ventasBolivares: VentaBs[];
  compraBolivares: Compra[];
  movimientos: Movimiento[];
}
