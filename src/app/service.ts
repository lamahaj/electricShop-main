import { Injectable } from '@angular/core';
import { Product } from './modules/product';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private jsonUrl = 'http://localhost:3000/products'; 

  private products: Product[] = [];

  constructor(private http: HttpClient) {
    
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(data => data.map(p => new Product(
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
      ))),
      tap(products => {
        this.products = products;
        console.log('Products loaded in service:', this.products.length);
      })
    );
  }

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getPopularProducts(): Product[] {
    return [...this.products]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);
  }

  getInStockProducts(): Product[] {
    return this.products.filter(p => p.inStock);
  }

  getOutOfStockProducts(): Product[] {
    return this.products.filter(p => !p.inStock);
  }

  searchProducts(searchTerm: string): Product[] {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // עדכון מוצר
  updateProduct(id: number, updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      
      this.http.put(`${this.jsonUrl}/${id}`, updatedProduct).subscribe({
        next: () => console.log('Successfully updated on server'),
        error: (err: any) => console.warn('PUT failed: Data updated in memory only.', err)
      });
    }
  }

  // מחיקת מוצר
  deleteProduct(id: number): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      
      this.http.delete(`${this.jsonUrl}/${id}`).subscribe({
        next: () => console.log('Successfully deleted from server'),
        error: (err: any) => console.warn('DELETE failed: Data deleted in memory only.', err)
      });
    }
  }
}