export interface Retiro {
  cuentaBancariaSalidaId: number;
  cuentaBancariaEntradaId: number | null;
  metodoPagoId: number;
  descripcionId: number;
  monto: number;
  fecha: string | null;

}
