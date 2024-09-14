import { Component, Inject } from '@angular/core';
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

  constructor(
    public dialogRef: MatDialogRef<ModalContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private gemeniService: GemeniService  // Inyectar el servicio Gemeni
  ) {}

  processData(): void {
    const prompt = `
      Simula ser un chatbot y recibe un string. Retorna los siguientes 4 datos de forma textual:
      1. El número del banco, que siempre empieza con 0 y tiene muchos dígitos.
      2. El documento del cliente.
      3. El nombre del cliente.
      tu respuesta debe estar en el siguiente orden
      nombreCuenta
      numeroCuenta,
      cedula
      nota: tu respuesta debe tener unicamente los valores en ese orden
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
        console.log()
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close({ nombreCuenta: '', numeroCuenta: '', cedula: '' });
  }
}

