import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-editproduct',
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
  templateUrl: './editproduct.component.html',
  styleUrl: './editproduct.component.scss'
})
export class EditproductComponent implements OnInit {

  productService: ProductsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  addProduct: FormGroup = new FormGroup({});
  formBuilder = inject(FormBuilder);
  imagePreview: string | ArrayBuffer | null = null;

   snackBar = inject(MatSnackBar);
    router: Router = inject(Router);

  prdId: number = 0;
  ngOnInit(): void {
    this.addProduct = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      image: ['']
    });  

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if(id) {
      const productId = Number(id);
      this.prdId = productId;
      this.productService.getProductById(productId).subscribe(
        (response) => {
          console.log(response);
          this.addProduct.patchValue(response);
        },
        (error) => {
          console.log(error);         
        }
      )
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
   this.productService.updateProduct(params, this.prdId).subscribe(
    (response) => {
      console.log("update-res", response);
      this.snackBar.open('Data updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']  // Custom class (optional)
      });
      this.router.navigateByUrl("/dashboard/productlist")
    }, 
    (error) => {
      console.log("update-errpr", error);
      this.snackBar.open('Failed to save data. Please try again', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']  // Custom class (optional)
      });
    }
   )
    
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
}
