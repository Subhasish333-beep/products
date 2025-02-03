import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-productlist',
  imports: [CommonModule, RouterModule, MatSelectModule, ReactiveFormsModule, FormsModule],
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {
  productService: ProductsService = inject(ProductsService);
  categories: any = [];
  selectedCategory: string = '';
  public productList: any[] = []; // Use an empty array instead of null
  loading: boolean = true;

  isModalOpen = signal(false);

  selectedProduct: any = null;

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.productService.getAllCategories().subscribe(
      (response: any) => {
        console.log('categories-res', response);
        this.categories = response;
      },
      (error) => {
        console.log('categories-err', error);
      }
    );

    this.productService.getAllProducts().subscribe(
      (response: any) => {
        console.log('Product response:', response);
        this.productList = response?.products || []; // Assign an empty array if response is null
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    );

    this.searchControl.valueChanges
  .pipe(
    debounceTime(500),
    distinctUntilChanged(),
    // filter(value => (value?.trim()?.length ?? 0) > 0) // Ensures value is not null/empty
  )
  .subscribe(query => {
    const searchQuery = query?.trim() ?? '';
    if (searchQuery.length === 0) {
      // If search is cleared, reload default products
      this.productService.getAllProducts().subscribe(
        (response: any) => {
          console.log('Product response:', response);
          this.productList = response?.products || []; // Assign an empty array if response is null
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.loading = false;
        }
      );
    } else {
      // Otherwise, fetch search results
      this.searchProducts(searchQuery);
    }
  });
  }

  openModal(product: any) {
    this.isModalOpen.set(true);
    this.selectedProduct = product;
  }

  closeModal() {
    console.log(this.selectedProduct);
    this.isModalOpen.set(false);
  }

  deleteProduct() {
    let id = Number(this.selectedProduct?.id);
    this.productService.deleteProduct(id).subscribe(
      (resposne) => {
        console.log('delete-product-res', resposne);
        this.closeModal();
      },
      (error) => {
        console.log('delete-product-err', error);
        this.closeModal();
      }
    );
  }

  searchProducts(query: string) {
    this.loading = true;
    this.productService.searchProduct(query).subscribe(
      (response: any) => {
        console.log('Search response:', response);
        this.productList = response?.products || [];
        this.loading = false;
      },
      (error) => {
        console.error('Search API error:', error);
        this.loading = false;
      }
    );
  }

  getCategoryProdutcs() {
    this.loading = true;
    if (this.selectedCategory === 'all') {
      this.productService.getAllProducts().subscribe(
        (response: any) => {
          console.log('Product response:', response);
          this.productList = response?.products || []; // Assign an empty array if response is null
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.loading = false;
        }
      );
    } else {
      this.productService
        .getProductsByCategory(this.selectedCategory)
        .subscribe(
          (response: any) => {
            this.loading = false;
            this.productList = response?.products || [];
            console.log('prod-cat-res', response);
          },
          (error) => {
            this.loading = false;
            console.log('prod-cat-err', error);
          }
        );
    }
  }
}
