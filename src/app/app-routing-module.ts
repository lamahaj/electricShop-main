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

const routes: Routes = [
  { path: '', component: Home },  
  { path: 'aboutus', component: Aboutus }, 
  { path: 'registration', component: Registration }, 
  { path: 'catalog', component: Catalog }, 
  { path: 'categories', component: Categories }, 
  { path: 'products', component: Products },
  { path: 'product/:id', component: ProductDetails },
  { path: '**', component: Error },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }