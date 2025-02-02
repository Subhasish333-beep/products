import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productlist',
  imports: [
    CommonModule
  ],
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {
  productService: ProductsService = inject(ProductsService);

  public productList: any[] = []; // Use an empty array instead of null
  loading: boolean = true;

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
}
