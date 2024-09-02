// interfaces/proveedor.ts
import { CompraBsDTO } from './compra-bs-dto';
import { CreditoProveedor } from './creditoProveedor'; // Asegúrate de importar la interfaz correctamente

export interface Proveedor {
  id: number;
  nombre: string | null;
  deuda: number;
  abono: number;
  creditosProveedor: CreditoProveedor[]; // Lista de créditos asociados al proveedor
  compra: CompraBsDTO[];
}
