// compra-bs-dto.ts
export interface CompraBsDTO {
  id?: any;
  proveedorId: number;
  metodoPagoId: number;
  cuentaBancariaBsId: number;
  cuentaBancariaPesosId?: number;
  descripcionId: number;
  fechaCompra: string; // Puedes cambiarlo a Date si prefieres manejarlo como objeto Date
  referencia: string;
  montoBs: number;
  precio?: number;
  tasaCompra: number;
  proveedor?: string;
  metodoPago?: string;
  cuentaBancariaBs?: string;
  cuentaBancariaPesos?: string;
}
