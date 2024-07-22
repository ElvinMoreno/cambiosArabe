import { Cliente } from "./clientes";
import { VentaBs } from "./venta-bs";


export interface Credito {
  id: number;
  cliente: Cliente;
  ventaBs: VentaBs;
  bolivares: number;
  precio: number;
  fechaRegistro: Date;
}
