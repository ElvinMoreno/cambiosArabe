import { Credito } from "./credito";
import { VentaBs } from "./venta-bs";

export interface Cliente{
    nombre:string,
    apellido:string,
    permitirCredito:boolean,
    credito?:Credito,
    ventasBs?:VentaBs
}
