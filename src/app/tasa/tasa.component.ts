import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasaService } from '../services/tasa.service';
import { Tasa } from '../interfaces/tasa';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tasa',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './tasa.component.html',
  styleUrls: ['./tasa.component.css']
})
export class TasaComponent implements OnInit {
  @ViewChild('captureElement') captureElement!: ElementRef;

  tasas: (Tasa & { editable: boolean })[] = [];

  constructor(private tasaService: TasaService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasas();
  }

  get isEditable(): boolean {
    return this.tasas.some(item => item.editable);
  }

  loadTasas(): void {
    this.tasaService.getAllTasas().subscribe(
      (data: Tasa[]) => {
        const tasaBase = data.find(item => item.id === 1);
        if (tasaBase) {
          this.tasas = data.map(item => {
            if (item.id! > 1) {
              item.tasaVenta = tasaBase.tasaVenta! + item.sumaTasa!;
            }
            return { ...item, editable: false };
          });
        } else {
          this.tasas = data.map(item => ({ ...item, editable: false }));
        }
      },
      (error: any) => {
        console.error('Error al cargar las tasas:', error);
      }
    );
  }

  editItem() {
    this.tasas.forEach(item => item.editable = true);
  }

  saveItem() {
    this.tasas.forEach((item: Tasa & { editable: boolean }, index: number) => {
      if (item.editable) {
        this.tasaService.updateTasa(item.id!, item).subscribe(
          (updatedItem: Tasa) => {
            item.editable = false;
            item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!, item.sumaTasa!);
            console.log('Item guardado:', updatedItem);
          },
          (error: any) => {
            console.error('Error al guardar la tasa:', error);
          }
        );
      }
    });
  }

  cancelEdit() {
    this.loadTasas();
  }

  updatePesos(item: Tasa) {
    item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!, item.sumaTasa!);
    console.log(item.pesos);
  }

  calculatePesos(bolivares: number, tasa: number, sumaTasa: number): number {
    return bolivares * (tasa + sumaTasa);
  }

  openActualizarTasaDialog(): void {
    const dialogRef = this.dialog.open(ActualizarTasaModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tasaItem = this.tasas.find(item => item.id === 1);
        if (tasaItem) {
          tasaItem.tasaVenta = result;
          tasaItem.pesos = this.calculatePesos(tasaItem.bolivares!, tasaItem.tasaVenta!, tasaItem.sumaTasa!);
          this.tasaService.updateTasa(tasaItem.id!, tasaItem).subscribe(
            updatedItem => {
              console.log('Tasa actualizada:', updatedItem);
              this.tasas.forEach(item => {
                if (item.id! > 1) {
                  item.tasaVenta = tasaItem.tasaVenta! + item.sumaTasa!;
                  item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!, item.sumaTasa!);
                }
              });
            },
            error => {
              console.error('Error al actualizar la tasa:', error);
            }
          );
        }
      }
    });
  }

  // Función para formatear la fecha a DD/MM/YYYY
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async downloadTableAsImage(): Promise<void> {
    const canvas = await html2canvas(this.captureElement.nativeElement);
    const imageData = canvas.toDataURL('image/jpeg');

    const img = new Image();
    img.src = '../assets/sourceImag/plantillaTasa.jpg'; // Ruta a tu imagen de plantilla
    img.onload = () => {
      const imgCanvas = document.createElement('canvas');
      const context = imgCanvas.getContext('2d')!;

      imgCanvas.width = 1080;
      imgCanvas.height = 1080;

      context.drawImage(img, 0, 0);

      // Agregar la fecha actual en la parte superior derecha
      const today = new Date();
      const dateString = this.formatDate(today); // Utilizar la función de formato de fecha
      const datePadding = 20; // Padding alrededor de la fecha
      const boxWidth = 300; // Ancho de las cajas
      const boxHeight = 70; // Altura de las cajas
      context.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Fondo negro con opacidad
      context.fillRect(imgCanvas.width - boxWidth - 50, 50, boxWidth, boxHeight); // Fondo negro con opacidad para la fecha
      context.fillStyle = '#fff';
      context.font = 'bold 50px Arial';
      context.textBaseline = 'middle'; // Centrar verticalmente el texto
      context.fillText(dateString, imgCanvas.width - boxWidth / 1.15 - 50, 50 + boxHeight / 2);

      // Agregar los títulos de las columnas
      const columnSpacing = 280; // Espacio entre columnas
      const titles = ['PESOS', 'TASA', 'BOLIVAR'];
      const baseXOffset = imgCanvas.width / 2 - (3 * columnSpacing) / 3; // Centrar las columnas
      const boxWidthTitle = 250; // Ancho fijo de las cajas para los títulos

      titles.forEach((title, i) => {
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(baseXOffset + i * columnSpacing - boxWidthTitle / 2, 260, boxWidthTitle, boxHeight); // Fondo negro para cada título
        context.fillStyle = '#fff';
        context.textAlign = 'center'; // Centrar horizontalmente el texto
        context.fillText(title, baseXOffset + i * columnSpacing, 300); // Posicionar el texto centrado
      });

      // Agregar los valores de la tabla centrados con fondo negro semitransparente
      context.font = 'bold 50px Arial'; // Fuente en negrita
      const lineHeight = 135; // Aumentar la altura de cada línea para más espacio entre filas
      const totalHeight = this.tasas.length * lineHeight;
      let yOffset = (imgCanvas.height - totalHeight) / 2 + 100; // Ajustar para títulos de columnas

      this.tasas.forEach((item, index) => {
        const baseXOffset = imgCanvas.width / 2 - (3 * columnSpacing) / 3; // Centrar las columnas
        
        // Fondo negro semitransparente para cada valor
        const textHeight = 80; // Altura del fondo
        const boxWidthFixed = 250; // Ancho fijo de las cajas

        context.fillStyle = 'rgba(0, 0, 0, 0.6)';

        const bolivaresText = `${item.bolivares}`;
        const tasaText = `${item.tasaVenta}`;
        const pesosText = `$${item.pesos}`;

        // Dibujar fondo para bolivares
        context.fillRect(baseXOffset + 2 * columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
        // Dibujar fondo para tasa
        context.fillRect(baseXOffset + columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
        // Dibujar fondo para pesos
        context.fillRect(baseXOffset - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);

        // Dibujar texto para bolivares
        context.fillStyle = '#fff';
        context.textAlign = 'center'; // Centrar horizontalmente el texto
        context.textBaseline = 'middle'; // Centrar verticalmente el texto
        context.fillText(bolivaresText, baseXOffset + 2 * columnSpacing, yOffset + index * lineHeight);

        // Dibujar texto para tasa con color específico
        context.fillStyle = '#FFD700'; // Amarillo
        context.fillText(tasaText, baseXOffset + columnSpacing, yOffset + index * lineHeight);

        // Dibujar texto para pesos
        context.fillStyle = '#fff';
        context.fillText(pesosText, baseXOffset, yOffset + index * lineHeight);
      });

      const finalImageData = imgCanvas.toDataURL('image/jpeg');

      const link = document.createElement('a');
      link.href = finalImageData;
      link.download = 'tasa_table.jpg';
      link.click();
    };
  }
}

@Component({
  selector: 'actualizar-tasa-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Actualizar Tasa</h2>
        <div class="separator"></div>
        <form (ngSubmit)="onGuardar()">
          <div class="form-group">
            <label for="tasa">Tasa <span class="required">*</span></label>
            <input id="tasa" type="number" [(ngModel)]="tasa" name="tasa" class="form-control" required>
          </div>
          <div class="button-group">
            <button type="button" class="btn-cancelar" (click)="onCancelar()">Cancelar</button>
            <button type="submit" class="btn-confirmar">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./tasa.component.css']
})
export class ActualizarTasaModalComponent {
  tasa!: number;

  constructor(public dialogRef: MatDialogRef<ActualizarTasaModalComponent>) {}

  onGuardar(): void {
    this.dialogRef.close(this.tasa);
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}
