export interface CuentaDestinatario {
  id?: number
  ventaBsId?: number ; // Suponiendo que la relación 'VentaBs' tiene un 'id' de tipo 'number'
  nombreCuentaDestinatario: string;
  cedula: number ;
  numeroCuenta: string;
  bancoId: number ; // Suponiendo que la relación 'Bancos' tiene un 'id' de tipo 'number'
  banco?: number ; // Suponiendo que la relación 'Bancos' tiene un 'id' de tipo 'number'
  bolivares: number;
  nombreClienteFinal?: string;
}
