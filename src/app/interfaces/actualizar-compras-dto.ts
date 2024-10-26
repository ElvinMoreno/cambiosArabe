import { CuentaBancaria } from "./cuenta-bancaria";
import { MetodoPago } from "./metodo-pago";
import { Proveedor } from "./proveedor";

export interface ActualizarCompraDTO {
  id: number;
  proveedor?: Proveedor;
  metodoPago?: MetodoPago;
  tasaCompra?: number;
  cuentaBancariaBs?: CuentaBancaria;
  cuentaBancariaPesos?: CuentaBancaria ;
  fechaCompra?: string;
  referencia?: number;
  montoBs?: number;
  precio?: number;
  entrada?: boolean;
  salida?: boolean;
}
