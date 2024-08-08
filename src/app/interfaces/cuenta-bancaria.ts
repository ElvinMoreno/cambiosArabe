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
  tipocuenta?: { id: number }; // Agregar tipocuenta para la creación
  banco?: { id: number }; // Agregar banco para la creación
}
