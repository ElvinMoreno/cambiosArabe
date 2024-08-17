import { MovimientoDiaDTO } from "./MovimientoDiaDTO";

export interface Descripcion {
  id?: number;
  texto: string;
  movimiento?: MovimientoDiaDTO[];
}
