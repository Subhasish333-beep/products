import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private apiUrl = 'https://dummyjson.com';
  private http = inject(HttpClient);

  getAllProducts() {
    return this.http.get(this.apiUrl+"/products")
  }

  addProduct(product:any) {
    return this.http.post(this.apiUrl+"/products/add", product)
  }

  getProductById(id: number) {
    return this.http.get(this.apiUrl+"/products/"+id);
  }

  updateProduct(product:any, id: number) {
    return this.http.put(this.apiUrl+"/products/"+id, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.apiUrl+"/products/"+id);
  }

  getAllCategories() {
    return this.http.get(this.apiUrl+"/products/categories");
  }

  getProductsByCategory(category: string) {
    return this.http.get(this.apiUrl+"/products/category/"+category)
  }

  searchProduct(query: string) {
    return this.http.get(this.apiUrl+"/products/search?q="+query);
  }

  featuredProducts() {
    return this.http.get(this.apiUrl+"/products?limit=12")
  }
}
