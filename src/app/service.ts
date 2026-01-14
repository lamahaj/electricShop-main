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

  // מיפוי ל-Product כמו שהיה לך
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

  // ✅ שליפה מהשרת (במקום מערך פנימי)
  getAllProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(data => data.map(p => this.toProduct(p)))
    );
  }

  // ✅ שליפה מוצר בודד מהשרת
  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.jsonUrl}/${id}`).pipe(
      map(p => this.toProduct(p))
    );
  }

  // ✅ חיפוש - עובד על השרת (באמצעות שליפה ואז פילטר)
  searchProducts(searchTerm: string): Observable<Product[]> {
    const term = (searchTerm || '').toLowerCase();
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.name.toLowerCase().includes(term)))
    );
  }

  // ✅ במלאי
  getInStockProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => p.inStock))
    );
  }

  // ✅ חסר במלאי
  getOutOfStockProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(p => !p.inStock))
    );
  }

  // ✅ פופולריים (אם יש לך soldCount בתוך Product)
  getPopularProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products =>
        [...products]
          .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
          .slice(0, 5)
      )
    );
  }

  // ✅ עדכון מוצר בשרת
  updateProduct(id: number, updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.jsonUrl}/${id}`, updatedProduct);
  }

  // ✅ מחיקת מוצר בשרת
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }

  // ✅ הוספת מוצר (דרישה: הוספה)
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.jsonUrl, product);
  }
}
