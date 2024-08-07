// src/app/interfaces/cuenta-bancaria.ts
export interface CuentaBancaria {
  id: number;
  nombreBanco: string | null;
  nombreCuenta: string | null;
  monto: number | null;
  numCuenta: number | null;
  limiteCB: number | null;
  limiteMonto: number | null;
  responsabe: string;
  responsable?: string;
}
