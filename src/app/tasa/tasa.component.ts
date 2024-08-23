import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasaService } from '../services/tasa.service';
import { Tasa } from '../interfaces/tasa';
import html2canvas from 'html2canvas';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tasa',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './tasa.component.html',
  styleUrls: ['./tasa.component.css']
})
export class TasaComponent implements OnInit {
  @ViewChild('captureElement') captureElement!: ElementRef;

  imageSrc: string | null = null; // Agrega esta propiedad
  tasas: (Tasa & { editable: boolean })[] = [];

  constructor(private tasaService: TasaService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasas();
  }

  ngAfterViewInit(): void {
    this.downloadTableAsImage();
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
    // Especifica el tipo del array de observables
    const updateObservables: Observable<Tasa>[] = [];

    this.tasas.forEach((item: Tasa & { editable: boolean }) => {
      if (item.editable) {
        // Agrega cada actualización al array de observables
        updateObservables.push(this.tasaService.updateTasa(item.id!, item));
      }
    });

    // Ejecuta todas las solicitudes de actualización en paralelo
    Promise.all(updateObservables.map(obs => obs.toPromise())).then(
      (updatedItems) => {
        updatedItems.forEach((updatedItem) => {
          if (updatedItem) { // Verificar que updatedItem no sea undefined
            const item = this.tasas.find(tasa => tasa.id === updatedItem.id);
            if (item) {
              item.editable = false;

              if (item.id === 1) { // Si es la tasa base, recalcula todas las demás
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

        // Recarga los datos sin recargar la página
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
    // Ahora solo se pasan dos parámetros, bolivares y tasaVenta
    item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);
    console.log(item.pesos);
  }


  calculatePesos(bolivares: number, tasa: number): number {
    return bolivares * tasa;
  }



  openActualizarTasaDialog(): void {
    const dialogRef = this.dialog.open(ActualizarTasaModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tasaItem = this.tasas.find(item => item.id === 1);
        if (tasaItem) {
          tasaItem.tasaVenta = result;
          this.tasaService.updateTasa(tasaItem.id!, tasaItem).subscribe(
            updatedItem => {
              console.log('Tasa actualizada:', updatedItem);
              this.tasas.forEach(item => {
                if (item.id! > 1) {
                  item.tasaVenta = tasaItem.tasaVenta! + item.sumaTasa!;
                  item.pesos = this.calculatePesos(item.bolivares!, item.tasaVenta!);
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


  // Función para formatear la fecha a "DD mes"
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  }

  // Función para formatear números con punto de miles
  formatNumber(num: number): string {
    return num.toLocaleString('es-ES'); // Esto agrega puntos de miles
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
      const dateString = this.formatDate(today);
      const datePadding = 20;
      const boxWidth = 300;
      const boxHeight = 70;
      context.fillStyle = 'rgba(0, 0, 0, 0.6)';
      context.fillRect(imgCanvas.width - boxWidth - 50, 50, boxWidth, boxHeight);
      context.fillStyle = '#fff';
      context.font = 'bold 45px Arial';
      context.textBaseline = 'middle';
      context.fillText(dateString, imgCanvas.width - boxWidth / 1.10 - 50, 50 + boxHeight / 2);

      // Agregar los títulos de las columnas
      const columnSpacing = 280;
      const titles = ['PESOS', 'TASA', 'BS'];
      const baseXOffset = imgCanvas.width / 2 - (3 * columnSpacing) / 3;
      const boxWidthTitle = 250;

      titles.forEach((title, i) => {
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(baseXOffset + i * columnSpacing - boxWidthTitle / 2, 260, boxWidthTitle, boxHeight);
        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.fillText(title, baseXOffset + i * columnSpacing, 300);
      });

      // Agregar los valores de la tabla
      context.font = 'bold 45px Arial';
      const lineHeight = 135;
      const totalHeight = this.tasas.length * lineHeight;
      let yOffset = (imgCanvas.height - totalHeight) / 2 + 100;

      this.tasas.forEach((item, index) => {
        const baseXOffset = imgCanvas.width / 2 - (3 * columnSpacing) / 3;
        const textHeight = 80;
        const boxWidthFixed = 250;
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';

        const bolivaresText = this.formatNumber(item.bolivares ?? 0);
        const tasaText = this.formatNumber(item.tasaVenta ?? 0);
        const pesosText = `$${this.formatNumber(item.pesos ?? 0)}`;

        context.fillRect(baseXOffset + 2 * columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
        context.fillRect(baseXOffset + columnSpacing - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);
        context.fillRect(baseXOffset - boxWidthFixed / 2, yOffset + index * lineHeight - textHeight / 2, boxWidthFixed, textHeight);

        context.fillStyle = '#fff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(bolivaresText, baseXOffset + 2 * columnSpacing, yOffset + index * lineHeight);
        context.fillStyle = '#FFD700';
        context.fillText(tasaText, baseXOffset + columnSpacing, yOffset + index * lineHeight);
        context.fillStyle = '#fff';
        context.fillText(pesosText, baseXOffset, yOffset + index * lineHeight);
      });

      const finalImageData = imgCanvas.toDataURL('image/jpeg');
      this.imageSrc = finalImageData;  // Actualizar la fuente de la imagen en el HTML
    };
  }


  async downloadTableAsVideo(): Promise<void> {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    // Ruta a tu video de plantilla
    const videoTemplatePath = '../assets/sourceImag/plantillaTasa.mp4';

    // Escribir el archivo de video de plantilla en el sistema de archivos de FFmpeg
    const videoData = await fetch(videoTemplatePath).then(res => res.arrayBuffer());
    ffmpeg.FS('writeFile', 'template.mp4', new Uint8Array(videoData));

    // Generar la imagen del canvas
    const canvas = await html2canvas(this.captureElement.nativeElement);
    const imgDataUrl = canvas.toDataURL('image/jpeg');
    const imgData = await fetch(imgDataUrl).then(res => res.arrayBuffer());
    ffmpeg.FS('writeFile', 'frame.jpg', new Uint8Array(imgData));

    // Combinar la imagen con el video de plantilla
    await ffmpeg.run(
      '-i', 'template.mp4',
      '-i', 'frame.jpg',
      '-filter_complex', 'overlay',
      '-c:v', 'libx264',
      '-r', '30',
      '-pix_fmt', 'yuv420p',
      'output.mp4'
    );

    // Leer el archivo de salida y descargarlo
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const videoUrl = URL.createObjectURL(videoBlob);

    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'tasa_table.mp4';
    link.click();
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
