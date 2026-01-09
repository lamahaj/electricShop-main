import { Injectable } from '@angular/core';
import { User } from '../modules/user';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private jsonUrl = 'http://localhost:3001/users'; 
  private usersList: User[] = [];
  
  // BehaviorSubject למעקב אחר המשתמש המחובר
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromSession());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUsers().subscribe();
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl).pipe(
      tap(data => this.usersList = data)
    );
  }

  getUsers(): User[] {
    return this.usersList;
  }

  // רישום משתמש חדש
  register(userData: Partial<User>): Observable<User> {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = this.usersList.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('משתמש עם מייל זה כבר קיים במערכת');
    }

    // יצירת ID חדש
    const newId = this.usersList.length > 0 
      ? Math.max(...this.usersList.map(u => u.id || 0)) + 1 
      : 1;
    
    const newUser = new User({ ...userData, id: newId });
    
    // הוספה למערך המקומי
    this.usersList.push(newUser);

    // שליחה לשרת
    return this.http.post<User>(this.jsonUrl, newUser).pipe(
      tap(() => console.log('User registered successfully'))
    );
  }

  // התחברות
  login(email: string, password: string): User | undefined {
    const user = this.usersList.find(u => 
      u.email === email && u.password === password
    );
    
    if (user) {
      // שמירה ב-sessionStorage
      this.saveUserToSession(user);
      // עדכון ה-BehaviorSubject
      this.currentUserSubject.next(user);
      console.log('Login successful:', user);
    }
    
    return user;
  }

  // התנתקות
  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  // קבלת המשתמש המחובר
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // החזרת משתמש לפי מייל
  getUserByEmail(email: string): User | undefined {
    return this.usersList.find(u => u.email === email);
  }

  // שמירה ב-session
  private saveUserToSession(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  // קריאה מ-session
  private getUserFromSession(): User | null {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      return new User(userData);
    }
    return null;
  }

  // בדיקה אם משתמש מחובר
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}