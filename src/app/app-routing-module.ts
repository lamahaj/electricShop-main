import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';  
import { Aboutus } from './aboutus/aboutus';
import { Error } from './error/error';
import { ProductDetails } from './product-details/product-details';
import { Registration } from './registration/registration';
import { Catalog } from './catalog/catalog';
import { Categories } from './categories/categories';
import { Products } from './products/products';
import { Profile } from './profile/profile';
import { Login } from './profile/login/login';
import { UserDetails } from './profile/user-details/user-details';

const routes: Routes = [
  { path: '', component: Home },  
  { path: 'aboutus', component: Aboutus }, 
  { path: 'registration', component: Registration }, 
  { path: 'catalog', component: Catalog }, 
  { path: 'categories', component: Categories }, 
  {
  path: 'profile',
  component: Profile,
  children: [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
     { path: 'login', component: Login },
    { path: 'register', component: Registration },
     { path: 'user-details', component: UserDetails },
  ],
},
  { path: 'products', component: Products },
  { path: 'product/:id', component: ProductDetails },
  
  { path: '**', component: Error },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }