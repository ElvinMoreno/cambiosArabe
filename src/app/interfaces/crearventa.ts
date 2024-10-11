import { CuentaDestinatario } from "./cuenta-destinatario";
import { VentaBs } from "./venta-bs";
import { VentaBsCuentaBancaria } from "./VentaBsCuentaBancaria";

export interface Crearventa {
  ventaBs: VentaBs;
  cuentasDestinatario: CuentaDestinatario[];
  ventaCuentaBacariaDTO: VentaBsCuentaBancaria[]

}
