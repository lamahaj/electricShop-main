import { Injectable } from '@angular/core';
import { User } from '../modules/user';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getUsers(): User[] {
    throw new Error('Method not implemented.');
  }

  private jsonUrl = 'http://localhost:3001/users';

  // מצב המשתמש המחובר
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromSession());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ✅ שליפה מהשרת (אין מערך מקומי)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl);
  }

  // ✅ רישום משתמש חדש: בדיקה מול השרת ואז POST
  register(userData: Partial<User>): Observable<User> {
    const email = (userData.email || '').trim().toLowerCase();

    if (!email) {
      throw new Error('אימייל הוא שדה חובה');
    }

    // json-server תומך סינון לפי שדות: /users?email=...
    return this.http.get<User[]>(`${this.jsonUrl}?email=${encodeURIComponent(email)}`).pipe(
      switchMap((existing: User[]) => {
        if (existing.length > 0) {
          throw new Error('משתמש עם מייל זה כבר קיים במערכת');
        }

        const newUser: User = new User({
          ...userData,
          email,
          isAdmin: userData.isAdmin ?? false
        });

        return this.http.post<User>(this.jsonUrl, newUser);
      }),
      tap(() => console.log('User registered successfully'))
    );
  }

  // ✅ התחברות מול השרת (אין usersList)
  login(email: string, password: string): Observable<User | null> {
    const e = (email || '').trim().toLowerCase();
    const p = (password || '').trim();

    if (!e || !p) return of(null);

    // json-server: /users?email=...&password=...
    return this.http.get<User[]>(
      `${this.jsonUrl}?email=${encodeURIComponent(e)}&password=${encodeURIComponent(p)}`
    ).pipe(
      map(users => (users.length ? new User(users[0]) : null)),
      tap(user => {
        if (user) {
          this.saveUserToSession(user);
          this.currentUserSubject.next(user);
          console.log('Login successful:', user);
        }
      })
    );
  }

  // ✅ התנתקות
  logout(): void {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('auth');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  // קבלת המשתמש המחובר
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // שמירה ב-session (כמו שיש לך)
  private saveUserToSession(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    sessionStorage.setItem('auth', JSON.stringify({
      email: user.email,
      image: user.profileImage || '',
      isAdmin: !!user.isAdmin
    }));
  }

  // קריאה מ-session
  private getUserFromSession(): User | null {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
      return new User(JSON.parse(userJson));
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
