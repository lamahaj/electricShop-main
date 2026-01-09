import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
 styleUrls: ['./navbar.css'],
})
export class Navbar {
  isMenuOpen = false;
  isLoggedIn = false;
  userName = 'למא';
  cartItemsCount = 0;

  constructor(private router: Router) {}

// התחברות / הרשמה
onAuthClick(type: 'login' | 'register'): void {
  this.isMenuOpen = false;

  if (type === 'login') {
    this.router.navigate(['/login']);
  } else {
    this.router.navigate(['/register']);
  }

  console.log(type === 'login' ? 'פתיחת התחברות' : 'פתיחת הרשמה');
}

// התנתקות
onLogout(): void {
  // סגירת תפריט
  this.isMenuOpen = false;

  // ניקוי נתוני משתמש
  this.isLoggedIn = false;
  this.userName = '';

  // ניקוי localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');

  // ניווט לדף הבית
  this.router.navigate(['/']);

  console.log('התנתקות בוצעה בהצלחה');

}


}