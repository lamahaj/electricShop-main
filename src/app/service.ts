import { Injectable } from '@angular/core';
import { Product } from './modules/product';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private jsonUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  private toProduct(p: any): Product {
    return new Product(
      Number(p.id),
      p.name,
      p.price,
      p.image,
      p.remainingStock,
      p.stock,
      p.brand,
      p.categoryId,
      p.description,
      p.category,
      p.specifications
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(data => data.map(p => this.toProduct(p)))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.jsonUrl}/${id}`).pipe(
      map(p => this.toProduct(p))
    );
  }


  getPopularProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products =>
        [...products]
          .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
          .slice(0, 5)
      )
    );
  }


}
