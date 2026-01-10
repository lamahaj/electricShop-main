import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {

  selectedCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) טוען מוצרים
    this.productService.fetchProducts().subscribe();

    // 2) קורא קטגוריה מה-URL מיידית (snapshot)
    const fromSnapshot = this.route.snapshot.queryParamMap.get('category');
    if (fromSnapshot !== null) {
      this.selectedCategoryId = Number(fromSnapshot);
      console.log('✅ Category from SNAPSHOT:', this.selectedCategoryId);
    }

    // 3) מאזין לשינויים ב-URL (אם משנים queryParams בלי reload)
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      this.selectedCategoryId = category !== undefined ? Number(category) : null;
      console.log('✅ Category from QUERY PARAMS:', this.selectedCategoryId);
    });
  }

  onCategorySelected(categoryId: number | null): void {
    console.log('📂 Category selected in Catalog:', categoryId);
    this.selectedCategoryId = categoryId;
  }
}