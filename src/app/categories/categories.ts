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

  categories = [
  { id: 1, name: 'טלוויזיות', icon: '📺' },
  { id: 2, name: 'סמארטפונים וטאבלטים', icon: '📱' },
  { id: 3, name: 'מחשבים ונייחים', icon: '💻' },
  { id: 4, name: 'אודיו ווידאו', icon: '🎧' },
  { id: 5, name: 'מוצרי חשמל לבית', icon: '🏠' },
  { id: 6, name: 'גיימינג', icon: '🎮' }
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
