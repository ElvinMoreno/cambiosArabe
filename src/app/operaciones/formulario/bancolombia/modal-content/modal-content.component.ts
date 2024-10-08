import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { GemeniService } from '../../../../services/gemini.service';

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
  pastedData: string = '';  // El texto pegado por el usuario
  resultJson: string = '';  // El resultado formateado en JSON

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<ModalContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gemeniService: GemeniService  // Inyectar el servicio Gemeni

  ) {}

  // Función para manejar el evento de pegar
  onPaste(event: ClipboardEvent): void {
    // Esperar a que el texto sea pegado antes de procesarlo
    setTimeout(() => {
      this.processData();
    }, 0);
  }

  processData(): void {
    const prompt = `
      Eres un encargado de identificar de un texto los siguiente campos
      1. El número del banco (que siempre empieza con 01 y tiene un largo de 20 digitos, muchas veces hay signos de puntación pero al quitarlos el tamao es de 20, de no ser así devolver "incompleto")
      2. El documento del cliente (caracterizado por ser un número de cédula.)
      3. El nombre del cliente.
      tu respuesta debe estar en el siguiente orden
      nombreCuenta,
      numeroCuenta,
      cedula
      Nota: los valores numericos como numeroCuenta y cedula no pueden tener espacios ni signos de puntación
      nota: si en el texto recibido hay alguna cadena que inicia en 04 esta debe enviarse por numeroCuenta
       El texto es el siguiente: ${this.pastedData}
    `;

    this.gemeniService.generateAnswer(prompt).subscribe(
      (response: any) => {
        const resultText: string = response.candidates[0].content.parts[0].text;
        const lines: string[] = resultText.split('\n').map((line: string) => line.trim());

        let nombreCuenta: string = '';
        let numeroCuenta: string = '';
        let cedula: string = '';

        // Asumimos que las líneas vienen en el orden especificado
        if (lines.length >= 3) {
          nombreCuenta = lines[0];
          numeroCuenta = lines[1];
          cedula = lines[2];
        }

        // Cerramos el diálogo y pasamos los datos
        this.dialogRef.close({ nombreCuenta, numeroCuenta, cedula });
      },
      (error: any) => {
        console.error('Error al obtener la respuesta:', error);
        this.dialogRef.close({ nombreCuenta: '', numeroCuenta: '', cedula: '', error: 'Error al procesar los datos.' });
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close({ nombreCuenta: '', numeroCuenta: '', cedula: '' });
  }

  onSelectFile(): void {
    this.fileInput.nativeElement.click(); // Simular un clic en el input de tipo archivo
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file);
      // Aquí puedes agregar la lógica para procesar la imagen
    }
  }

}
