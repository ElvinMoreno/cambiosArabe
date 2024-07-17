export interface Proveedor {
  id: number;
  nombre: string | null;
  deuda: number;
  abono: number;
  creditosProveedor: CreditoProveedor[];
  compra: Compra[];
}

export interface CreditoProveedor {
  // Define los campos que sean necesarios según la estructura de CreditoProveedor en el backend
}

export interface Compra {
  // Define los campos que sean necesarios según la estructura de Compra en el backend
}
