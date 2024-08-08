import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Bancos } from '../../../interfaces/bancos';
import { BancosService } from '../../../services/banco.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-bancos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './modal-bancos.component.html',
  styleUrls: ['./modal-bancos.component.css']
})
export class ModalBancosComponent implements OnInit {
  bancos: Bancos[] = [];
  selectedBanco: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalBancosComponent>,
    private bancosService: BancosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.bancosService.getBancosVenezolanos().subscribe(
      (data: Bancos[]) => {
        this.bancos = data;
      },
      (error) => {
        console.error('Error al cargar los bancos', error);
      }
    );
  }

  onConfirm(): void {
    if (this.selectedBanco) {
      this.dialogRef.close({ bancoId: this.selectedBanco, venta: this.data.venta });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
