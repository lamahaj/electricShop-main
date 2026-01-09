import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {
  
  selectedCategoryId: number | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.fetchProducts().subscribe();
  }

  onCategorySelected(categoryId: number | null): void {
    console.log('📂 Category selected in Catalog:', categoryId);
    this.selectedCategoryId = categoryId;
  }
}