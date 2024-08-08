export interface VentaPagos {
  id?: number;  // Optional for updates, auto-generated for new records
  nombreCuentaCop: string;
  pesosRecibidos: number;
  nombreCuentaBs?: string;
  bolivaresEnviar: number;
  bancoDestino: string;
  cedulaDestino: number;
  numeroCuentaDestinatario: number;
  nombreCuentaDestinatario: string;
  responsable: string;
}
