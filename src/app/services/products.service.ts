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
}
