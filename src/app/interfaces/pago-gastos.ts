import { Gastos } from './gastos';
export interface PagoGastos {
  fecha: Date;
  monto: number;
  descriocion: string;
  gasto: Gastos;
}
