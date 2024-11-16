import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { GeminiService } from '../../../../services/gemini.service';
import * as Tesseract from 'tesseract.js';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [
    MatDialogActions, MatDialogContent, MatButtonModule,
    MatFormFieldModule, FormsModule, MatDialogTitle, MatDialogClose, MatInputModule,
    MatFormFieldModule, CommonModule
  ],
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent {
  pastedData: string = ''; // El texto pegado o extraído
  isLoading: boolean = false; // Indicador de carga para OCR

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<ModalContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gemeniService: GeminiService // Inyectar el servicio Gemeni
  ) {}

  // Función para manejar la selección de archivos
  onSelectFile(): void {
    this.fileInput.nativeElement.click(); // Simular un clic en el input de tipo archivo
  }

  // Manejar la selección del archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);
      this.processImage(file);
    }
  }

  // Procesar la imagen con Tesseract.js para realizar OCR
  processImage(image: File): void {
    this.isLoading = true; // Mostrar indicador de carga
    const imageUrl = URL.createObjectURL(image);

    Tesseract.recognize(imageUrl, 'eng', {
      logger: (m) => console.log(m), // Ver progreso del procesamiento
    })
      .then(({ data: { text } }) => {
        this.pastedData = text; // Pegar el texto extraído en el área de texto
        console.log('Texto extraído:', text);
        this.isLoading = false; // Ocultar indicador de carga
      })
      .catch((error) => {
        console.error('Error durante el OCR:', error);
        this.isLoading = false; // Ocultar indicador de carga
      });
  }

  // Función para manejar el evento de pegar
  onPaste(event: ClipboardEvent): void {
    setTimeout(() => {
      this.processData();
    }, 0);
  }

  processData(): void {
    const prompt = `
      Eres un chatbot que se recibe un texto, debes extraer, El número del banco (que siempre empieza con 01, si su longitud es menor a 20 retornar "incompleto"),
       el documento del cliente, el nombre del cliente. tu respuesta debe estar en el siguiente orden
      nombreCuenta,
      numeroCuenta,
      cedula
      Nota: los valores numericos como numeroCuenta y cedula no pueden tener espacios ni signos de puntación
      nota: si en el texto recibido hay alguna cadena que inicia en 04 esta debe enviarse por numeroCuenta
      nota: solo retornar el valor
       El texto es el siguiente: ${this.pastedData}
    `;
    this.isLoading = true; // Mostrar indicador de carga
    this.gemeniService.generateContent(prompt).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (
          response?.candidates?.[0]?.content?.parts?.[0]?.text
        ) {
          const resultText = response.candidates[0].content.parts[0].text;
          const lines: string[] = resultText.split('\n').map((line: string) => line.trim());

          let nombreCuenta: string = '';
          let numeroCuenta: string = '';
          let cedula: string = '';

          if (lines.length >= 3) {
            nombreCuenta = lines[0];
            numeroCuenta = lines[1];
            cedula = lines[2];
          }

          this.dialogRef.close({ nombreCuenta, numeroCuenta, cedula });
        } else {
          console.error('Respuesta inesperada de la API:', response);
          this.dialogRef.close({
            nombreCuenta: '',
            numeroCuenta: '',
            cedula: '',
            error: 'Respuesta inesperada de la API.',
          });
        }
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error al obtener la respuesta:', error);
        this.dialogRef.close({
          nombreCuenta: '',
          numeroCuenta: '',
          cedula: '',
          error: 'No se pudo procesar la solicitud. Intenta más tarde.',
        });
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close({ nombreCuenta: '', numeroCuenta: '', cedula: '' });
  }
}
