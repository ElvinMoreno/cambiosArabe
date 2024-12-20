import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasaService } from '../services/tasa.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { Tasa } from '../interfaces/tasa';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs';
import { CloudinaryModule } from '@cloudinary/ng';
import { fill } from "@cloudinary/url-gen/actions/resize";

@Component({
  selector: 'app-tasa',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, CloudinaryModule],
  templateUrl: './tasa.component.html',
  styleUrls: ['./tasa.component.css']
})
export class TasaComponent implements OnInit {
  @ViewChild('captureElement') captureElement!: ElementRef;
  imageSrc: string | null = null;
  tasas: (Tasa & { editable: boolean })[] = [];
  uploadImageUrl: string | null = null; // URL de la imagen subida
  selectedFile: File | null = null; // Archivo seleccionado por el usuario

  constructor(
    private tasaService: TasaService,
    private cloudinaryService: CloudinaryService,
    public dialog: MatDialog
  ) {}

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
              item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);
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
    const updateObservables: Observable<Tasa>[] = this.tasas
      .filter(item => item.editable)
      .map(item => this.tasaService.updateTasa(item.id!, item));

    Promise.all(updateObservables.map(obs => obs.toPromise())).then(
      (updatedItems) => {
        updatedItems.forEach((updatedItem) => {
          if (updatedItem) {
            const item = this.tasas.find(tasa => tasa.id === updatedItem.id);
            if (item) {
              item.editable = false;
              if (item.id === 1) {
                this.tasas.forEach(otherItem => {
                  if (otherItem.id !== 1) {
                    otherItem.tasaVenta = updatedItem.tasaVenta! + otherItem.sumaTasa!;
                    otherItem.pesos = this.calculatePesos(otherItem.bolivares!, otherItem.tasaVenta!);
                  }
                });
              } else {
                item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);
              }
            }
          }
        });

        console.log('Todas las tasas han sido actualizadas:', updatedItems);
        this.loadTasas();
      }
    ).catch((error) => {
      console.error('Error al guardar las tasas:', error);
    });
  }

  cancelEdit() {
    this.loadTasas();
  }

  updatePesos(item: Tasa) {
    item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);
  }

  calculatePesos(bolivares: number, tasa: number): number {
    return bolivares * tasa;
  }

  openActualizarTasaDialog(): void {
    const dialogRef = this.dialog.open(ActualizarTasaModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tasaItem = this.tasas.find(item => item.id === 1); // Encuentra la tasa principal
        if (tasaItem) {
          tasaItem.tasaVenta = result; // Actualiza la tasa principal con el nuevo valor
          this.tasaService.updateTasa(tasaItem.id!, tasaItem).subscribe(
            updatedItem => {
              // Actualiza las tasas de los otros elementos
              if (updatedItem) {
                this.tasas.forEach(item => {
                  if (item.id! > 1) {
                    item.tasaVenta = updatedItem.tasaVenta! + item.sumaTasa!;
                    item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);

                    // Aquí actualizamos las otras tasas en la base de datos
                    this.tasaService.updateTasa(item.id!, item).subscribe(
                      updatedItem => {
                        console.log('Tasa actualizada:', updatedItem);
                      },
                      error => {
                        console.error('Error al actualizar las tasas secundarias:', error);
                      }
                    );
                  }
                });
              }
            },
            error => {
              console.error('Error al actualizar la tasa principal:', error);
            }
          );
        }
      }
    });
  }


  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const month = monthNames[date.getMonth()];

    return `${day} ${month}`;
  }

  formatNumber(num: number): string {
    return num.toLocaleString('es-ES');
  }

  async downloadTableAsImage(): Promise<void> {
    try {
      // Captura el contenido del elemento y genera un canvas
      const canvas = await html2canvas(this.captureElement.nativeElement);

      // Carga la imagen de plantilla
      const img = new Image();
      img.src = '../assets/sourceImag/plantillaTasa.jpg';

      img.onload = () => {
        const imgCanvas = document.createElement('canvas');
        const context = imgCanvas.getContext('2d')!;
        imgCanvas.width = 1080;
        imgCanvas.height = 1080;

        // Dibuja la imagen de plantilla en el canvas
        context.drawImage(img, 0, 0);

      // Añade la fecha al canvas
      const today = new Date();
      const dateString = this.formatDate(today);
      context.fillStyle = 'rgba(0, 0, 0, 0.6)';
      context.fillRect(imgCanvas.width - 420, 50, 400, 70);
      context.fillStyle = '#fff';
      context.font = 'bold 45px "Kanit Medium"';
      context.textBaseline = 'middle';
      context.fillText(dateString, imgCanvas.width - 400, 85);

        // Añade los datos de la tabla al canvas
        this.addTableDataToCanvas(context, imgCanvas);

        // Convierte el canvas a Blob y descarga la imagen
        imgCanvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'imagen_tasa.jpg';
            link.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg');
      };

      img.onerror = () => {
        console.error('Error al cargar la imagen de plantilla.');
      };

    } catch (error) {
      console.error('Error al generar la imagen:', error);
    }
  }


  // Método que combina la selección de imagen, carga y visualización en una pestaña nueva
  onFileSelectedAndUpload(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // Limitar a 10 MB
        alert('El tamaño de la imagen excede el límite permitido de 10MB.');
        return;
      }

      this.selectedFile = file;

      const publicId = 'uroe8jwhkdzunwpkikte'; // Public ID predefinido

      // Subir imagen a Cloudinary
      this.cloudinaryService.uploadImageWithOverwrite(this.selectedFile, publicId).subscribe(
        response => {
          console.log('Imagen subida exitosamente:', response);
          if (response && response.secure_url) {
            this.imageSrc = response.secure_url;

            // Abrir la imagen en una nueva pestaña inmediatamente después de subirla
            this.openImageInNewTab();
          }
        },
        error => {
          console.error('Error al subir la imagen:', error);
        }
      );
    }
  }

  openImageInNewTab(): void {
    if (this.imageSrc) {
      window.open(this.imageSrc, '_blank', 'Imagen Subida');
    } else {
      alert('No hay una imagen disponible para mostrar. Por favor, sube una imagen primero.');
    }
  }


addTableDataToCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const columnSpacing = 280;
  const titles = ['PESOS', 'TASA', 'BS'];
  const baseXOffset = canvas.width / 2 - (3 * columnSpacing) / 3;
  const boxWidthTitle = 250;

  // Configura la fuente a 'Kanit Medium' para el texto de los títulos
  context.font = 'bold 45px "Kanit Medium"';
  titles.forEach((title, i) => {
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';
    context.fillRect(baseXOffset + i * columnSpacing - boxWidthTitle / 2, 260, boxWidthTitle, 70);
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.fillText(title, baseXOffset + i * columnSpacing, 300);
  });

  const lineHeight = 135;
  const totalHeight = this.tasas.length * lineHeight;
  let yOffset = (canvas.height - totalHeight) / 2 + 100;

  this.tasas.forEach((item, index) => {
    const textHeight = 80;
    const boxWidthFixed = 250;
    context.fillStyle = 'rgba(0, 0, 0, 0.6)';

    const bolivaresText = this.formatNumber(item.bolivares ?? 0);
    const tasaText = this.formatNumber(item.tasaVenta ?? 0);
    const pesosText = `$${this.formatNumber(item.pesos ?? 0)}`;

    context.fillRect(baseXOffset + 2 * columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
    context.fillRect(baseXOffset + columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
    context.fillRect(baseXOffset - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);

    // Usa 'Kanit Medium' para los textos de cada fila
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 45px "Kanit Medium"';
    context.fillText(bolivaresText, baseXOffset + 2 * columnSpacing, yOffset + index * lineHeight);
    context.fillStyle = '#ffc600';
    context.font = 'bold 45px "Kanit ExtraBold"';
    context.fillText(tasaText, baseXOffset + columnSpacing, yOffset + index * lineHeight);
    context.fillStyle = '#fff';
    context.fillText(pesosText, baseXOffset, yOffset + index * lineHeight);
  });
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
