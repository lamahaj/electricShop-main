import { Component, Output, EventEmitter } from '@angular/core';

interface Category {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories {
  
  @Output() categorySelected = new EventEmitter<number | null>();
  
  activeCategoryId: number | null = null;

  categories: Category[] = [
    { id: 1, name: 'סמארטפונים וטאבלטים', icon: '📱' },
    { id: 2, name: 'מחשבים וטלוויזיות', icon: '💻' }
  ];

  selectCategory(categoryId: number): void {
    console.log('📂 Category clicked:', categoryId);
    this.activeCategoryId = categoryId;
    this.categorySelected.emit(categoryId);
  }

  showAllProducts(): void {
    console.log('📂 Show all products');
    this.activeCategoryId = null;
    this.categorySelected.emit(null);
  }
}