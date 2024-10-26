import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { appsetting } from '../settings/appsetting';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private apiUrl = `${appsetting.apiUrl}`;

  private stompClient: Client;
   // Subject para emitir notificaciones a los componentes
   private notificationSubject = new Subject<string>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${this.apiUrl}websocket`),  // Dynamically use apiUrl for WebSocket connection
      reconnectDelay: 5000,  // Try to reconnect every 5 seconds if connection drops
      heartbeatIncoming: 4000,  // Heartbeat settings to keep connection alive
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP debug: ', str);
      },
      onConnect: (frame) => {
        console.log('Successfully connected to WebSocket server.', frame);
        this.subscribeToTopic();  // Ensure subscription happens only after connection is established
      },
      onStompError: (frame) => {
        console.error('Error with STOMP connection', frame);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket server.');
      }
    });
  }

  connect() {
    console.log('Connecting to WebSocket server...');
    this.stompClient.activate();  // Initiates the WebSocket connection
  }

  disconnect() {
    if (this.stompClient) {
      console.log('Disconnecting from WebSocket server...');
      this.stompClient.deactivate();  // Closes the WebSocket connection
    }
  }

  showReloadMessage: boolean = false;

  subscribeToTopic() {
    console.log('Subscribing to topic /topic/notifications');
    this.stompClient.subscribe('/topic/notifications', message => {
      const receivedMessage = message.body;

      // Emitir el mensaje a los suscriptores (componentes)
      this.notificationSubject.next(receivedMessage);

      // Recarga la página después de 3 segundos
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  }


  sendMessage(message: any) {
   // console.log('Sending message: ', message);
    this.stompClient.publish({
      destination: '/app/sendMessage',  // Ensure this matches the backend controller mapping
      body: JSON.stringify(message),
    });
  }

   // Método público para que los componentes puedan suscribirse a las notificaciones
   onNotification(): Observable<string> {
    return this.notificationSubject.asObservable();
  }
}
