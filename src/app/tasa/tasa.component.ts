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
      (error) => {
        console.error('Error al cargar las tasas:', error);
      }
    );
  }

  editItem() {
    this.tasas.forEach(item => item.editable = true);
  }

  saveItem() {
    this.tasas.forEach((item, index) => {
      if (item.editable) {
        this.tasaService.updateTasa(item.id!, item).subscribe(
          (updatedItem: Tasa) => {
            item.editable = false;
            item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!, item.sumaTasa!);
            console.log('Item guardado:', updatedItem);
          },
          (error) => {
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

  async downloadTableAsImage(): Promise<void> {
    const canvas = await html2canvas(this.captureElement.nativeElement);
    const imageData = canvas.toDataURL('image/jpeg');

    const img = new Image();
    img.src = '../assets/sourceImag/plantillaTasa.jpg'; // Ruta a tu imagen de plantilla
    img.onload = () => {
      const imgCanvas = document.createElement('canvas');
      const context = imgCanvas.getContext('2d')!;

      imgCanvas.width = img.width;
      imgCanvas.height = img.height;

      context.drawImage(img, 0, 0);

      // Agregar los valores de la tabla centrados
      context.fillStyle = '#fff';
      context.font = 'bold 50px Arial'; // Fuente en negrita

      // Calcular la posición vertical inicial
      const lineHeight = 135; // Aumentar la altura de cada línea para más espacio entre filas
      const totalHeight = this.tasas.length * lineHeight;
      let yOffset = (imgCanvas.height - totalHeight) / 1.55;

      const columnSpacing = 250; // Espacio entre columnas

      this.tasas.forEach((item, index) => {
        // Calcular la posición horizontal del texto
        const baseXOffset = imgCanvas.width / 2 - (3 * columnSpacing) / 2.7; // Centrar las columnas
        
        context.fillText(`${item.pesos}`, baseXOffset + 2 * columnSpacing, yOffset + index * lineHeight);
        context.fillText(`${item.bolivares}`, baseXOffset, yOffset + index * lineHeight);
        context.fillText(`${item.tasaVenta}`, baseXOffset + columnSpacing, yOffset + index * lineHeight);

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
