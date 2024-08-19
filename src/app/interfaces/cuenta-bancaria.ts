import { Bancos } from "./bancos";

export interface CuentaBancaria {
  id: number;
  nombreBanco: string | null;
  nombreCuenta: string | null;
  bancoNombre?: Bancos;
  monto: number | null;
  numCuenta: number | null;
  limiteCB: number | null;
  limiteMonto: number | null;
  responsable?: string;
  banco?: { id: number }; // Agregar banco para la creación
}
