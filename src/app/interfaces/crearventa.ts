import { CuentaDestinatario } from "./cuenta-destinatario";
import { VentaBs } from "./venta-bs";

export interface Crearventa {
  ventaBs: VentaBs;
  cuentasDestinatario: CuentaDestinatario[];
}
