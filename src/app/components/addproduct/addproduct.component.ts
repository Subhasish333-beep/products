import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-addproduct',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.scss'
})
export class AddproductComponent {

  addProduct: FormGroup = new FormGroup({});
  formBuilder = inject(FormBuilder);
  imagePreview: string | ArrayBuffer | null = null;
  productService: ProductsService = inject(ProductsService);

  snackBar = inject(MatSnackBar);
  router = inject(Router)

  ngOnInit(): void {
    this.addProduct = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      image: ['']
    });  
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.addProduct.patchValue({ image: file });
      this.addProduct.get('image')?.updateValueAndValidity();

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const params = {
      title: this.addProduct.value.title,
      description: this.addProduct.value.description,
      price: this.addProduct.value.price,
      thumbnail: this.addProduct.value.image
    }
    // console.log(signIn);
   this.productService.addProduct(params).subscribe(
    (response) => {
      console.log("add-res", response);
      this.snackBar.open('Product added successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']  // Custom class (optional)
      });
      this.router.navigateByUrl("/dashboard/productlist")
    }, 
    (error) => {
      console.log("add-errpr", error);
      
    }
   )
    
  }

}
