export class User {
  id?: number;
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';           // ← הוספנו
  birthDate: string = '';           // ← הוספנו (פורמט: YYYY-MM-DD)
  gender: 'male' | 'female' = 'male';  // ← הוספנו
  profileImage?: string;            // ← הוספנו (URL לתמונה)

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  // Getter לתמונת ברירת מחדל לפי מין
  get defaultImage(): string {
    return this.profileImage || (this.gender === 'male' 
      ? '/assets/avatar-male.jpg' 
      : '/assets/female-avatar.webp');
  }

  // Getter לגיל מחושב
  get age(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}