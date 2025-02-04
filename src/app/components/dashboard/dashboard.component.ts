import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../interface/user';
import {
  RouterModule,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule, MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthenticationService);
  private currentUser: User | null = null;
  private router: Router = inject(Router);
  pageTitle: string = 'Dashboard';
  productService: ProductsService = inject(ProductsService);
  loading: boolean = true;
  public productList: any[] = [];
  activatedRoute = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);
  isModalOpen = signal(false);
  selectedProduct: any = null;

  ngOnInit(): void {
    this.productService.featuredProducts().subscribe(
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

    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);
    let authenticated = this.authService.isAuthenticated();
    console.log(authenticated);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Get the current route path after navigation
        const currentRoute =
          this.activatedRoute.firstChild?.snapshot.url[0]?.path;
        console.log('current', currentRoute);

        // Set the page title based on the current route
        if (currentRoute === 'productlist') {
          this.pageTitle = 'Product Listing';
        } else if (currentRoute === 'addproduct') {
          this.pageTitle = 'Add Product';
        } else if (currentRoute?.startsWith('editproduct')) {
          this.pageTitle = 'Edit Product';
        } else {
          this.pageTitle = 'Dashboard'; // Default title
        }
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
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
        this.snackBar.open('Data deleted successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']  // Custom class (optional)
        });
        this.closeModal();
      },
      (error) => {
        console.log('delete-product-err', error);
        this.snackBar.open('Sorry something went wrong. Please try again', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']  // Custom class (optional)
        });
        this.closeModal();
      }
    );
  }

}
