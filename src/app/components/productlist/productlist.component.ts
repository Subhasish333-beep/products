import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-productlist',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {
  productService: ProductsService = inject(ProductsService);

  public productList: any[] = []; // Use an empty array instead of null
  loading: boolean = true;

  isModalOpen= signal(false)

  selectedProduct: any = null;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        console.log("Product response:", response);
        this.productList = response?.products || []; // Assign an empty array if response is null
        this.loading = false;
        
      },
      (error) => {
        console.error("Error fetching products:", error);
        this.loading = false;
      }
    );
  }

  openModal(product: any) {
    this.isModalOpen.set(true);
    this.selectedProduct = product;
  }

  closeModal() {
    console.log(this.selectedProduct);
    this.isModalOpen.set(false)
  }

  deleteProduct() {
    let id = Number(this.selectedProduct?.id);
    this.productService.deleteProduct(id).subscribe(
      (resposne) => {
        console.log("delete-product-res", resposne);
        this.closeModal();
      },
      (error) => {
        console.log("delete-product-err", error);
        this.closeModal();
      }
    )
  }
}

