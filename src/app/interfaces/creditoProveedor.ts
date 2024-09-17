import {  Proveedor } from "./proveedor";
import {CompraBsDTO} from "./compra-bs-dto"

export interface CreditoProveedor {
  id: number;
  proveedor: Proveedor;
  compra: CompraBsDTO;
  monto: number; // Propiedad para el monto total del crédito
  saldoActual: number; // Propiedad para el monto restante del crédito
  fecha: Date; // Propiedad para la fecha de registro del crédito
}

  