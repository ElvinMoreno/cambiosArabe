// upload.component.ts
import { Component } from '@angular/core';
import { CloudinaryService } from '../services/cloudinary.service';


@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  publicId: string = '';
  optimizedUrl: string = '';
  autoCropUrl: string = '';

  constructor(private cloudinaryService: CloudinaryService) { }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.cloudinaryService.uploadImage(file).subscribe(
  //       response => {
  //         console.log('Imagen subida con éxito:', response);
  //         this.publicId = response.public_id; // Asegúrate de que esta es la clave correcta en la respuesta
  //       },
  //       error => {
  //         console.error('Error subiendo la imagen:', error);
  //       }
  //     );
  //   }
  // }

  getOptimizedImageUrl(): void {
    if (this.publicId) {
      this.cloudinaryService.getOptimizedUrl(this.publicId).subscribe(
        response => {
          this.optimizedUrl = response;
          console.log('URL optimizada:', this.optimizedUrl);
        },
        error => {
          console.error('Error obteniendo URL optimizada:', error);
        }
      );
    }
  }

  getAutoCropImageUrl(): void {
    if (this.publicId) {
      this.cloudinaryService.getAutoCropUrl(this.publicId).subscribe(
        response => {
          this.autoCropUrl = response;
          console.log('URL con auto-crop:', this.autoCropUrl);
        },
        error => {
          console.error('Error obteniendo URL con auto-crop:', error);
        }
      );
    }
  }
}
