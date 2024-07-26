import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';  // Importar MatDialogRef

@Component({
  selector: 'app-tasa',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './tasa.component.html',
  styleUrls: ['./tasa.component.css']
})
export class TasaComponent {
  tasas = [
    { bolivares: 100, tasa: 2.0, pesos: this.calculatePesos(100, 2.0), editable: false },
    { bolivares: 500, tasa: 2.3, pesos: this.calculatePesos(500, 2.3), editable: false },
    { bolivares: 1000, tasa: 2.7, pesos: this.calculatePesos(1000, 2.7), editable: false }
  ];

  originalData = [...this.tasas];

  constructor(public dialog: MatDialog) {}

  editItem(index: number) {
    this.tasas[index].editable = true;
  }

  saveItem(index: number) {
    this.tasas[index].editable = false;
    this.tasas[index].pesos = this.calculatePesos(this.tasas[index].bolivares, this.tasas[index].tasa);
    this.originalData[index] = { ...this.tasas[index] };
    console.log('Item guardado:', this.tasas[index]);
  }

  cancelEdit(index: number) {
    this.tasas[index] = { ...this.originalData[index] };
    this.tasas[index].editable = false;
    console.log('Edición cancelada:', this.tasas[index]);
  }

  updatePesos(item: any) {
    item.pesos = this.calculatePesos(item.bolivares, item.tasa);
  }

  calculatePesos(bolivares: number, tasa: number): string {
    return (bolivares * tasa).toFixed(2);
  }

  openActualizarTasaDialog(): void {
    const dialogRef = this.dialog.open(ActualizarTasaModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasas.forEach(item => {
          item.tasa = result;
          item.pesos = this.calculatePesos(item.bolivares, item.tasa);
        });
        console.log('Tasa actualizada:', result);
      }
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
