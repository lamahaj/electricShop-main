export class User {
  id?: number;
  username: string = '';
  email: string = '';
  password: string = '';
  fullName: string = '';           
  birthDate: string = '';           
  gender: 'male' | 'female' = 'male';  
  profileImage?: string; 
  isAdmin: boolean = false;           

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  
  get defaultImage(): string {
    return this.profileImage || (this.gender === 'male' 
      ? '/assets/avatar-male.jpg' 
      : '/assets/female-avatar.webp');
  }

 
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