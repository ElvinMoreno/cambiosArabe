import { Movimiento } from "./movimiento";

export interface Descripcion {
  id?: number;
  texto: string;
  movimiento?: Movimiento[];
}
