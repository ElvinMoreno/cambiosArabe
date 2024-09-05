import {  Proveedor } from "./proveedor";
import {CompraBsDTO} from "./compra-bs-dto"

export interface CreditoProveedor {
  id: number;
  proveedor: Proveedor;
  compra: CompraBsDTO;
  monto: number; // Propiedad para el monto total del crédito
  montoRestante: number; // Propiedad para el monto restante del crédito
  fechaRegistro: Date; // Propiedad para la fecha de registro del crédito
}

  