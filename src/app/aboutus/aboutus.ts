import { Component } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  standalone: false,
  templateUrl: './aboutus.html',
 styleUrls: ['./aboutus.css']
})
export class Aboutus {
  lamaImage: string = '/assets/lama.jpg';
  lamaName: string = 'Lama Haj';
  lamaId: string = '212389845';
  galImage: string = '/assets/gal.jpg';
  galName: string = 'Gal Katz';
  galId: string = '311488977';
  isAccessible: boolean = false;
toggleAccessibility() {
  this.isAccessible = !this.isAccessible;
}
}
