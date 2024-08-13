import { Credito } from "./credito";
import { VentaBs } from "./venta-bs";

export interface Cliente {
  id: number;  // Asegúrate de incluir el ID si no estaba ya
  nombre: string;
  apellido?: string;  // Si apellido es opcional
  permitirCredito: boolean;
  limiteCredito: number;  // Añadir campo para el límite de crédito
  cedula: string;
  creditos: Credito[];  // Relación uno a muchos con créditos
  ventasBs?: VentaBs[];  // Si las ventas son opcionales y pueden ser varias
}

