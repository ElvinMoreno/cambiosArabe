import { CuentaBancaria } from './cuenta-bancaria';

export interface TipoCuentaBancaria {
  id: number;
  nombre: string;
  divisa: string;
  cuentasBancarias: CuentaBancaria[];
}
