import { Credito } from "./credito";
import { VentaBs } from "./venta-bs";

export interface Cliente{
    nombre:string,
    apellido:string,
    permitirCredito:boolean,
    cedula: string,
    credito?:Credito,
    ventasBs?:VentaBs
}
