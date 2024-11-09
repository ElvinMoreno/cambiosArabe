import { Gastos } from './gastos';
export interface PagoGastos {
  id? :number;
  fecha: Date;
  monto: number;
  descriocion: string;
  gasto: Gastos;
}
