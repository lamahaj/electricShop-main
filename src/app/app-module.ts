import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Aboutus } from './aboutus/aboutus';
import { Home } from './/home/home';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { Error } from './error/error';
import { ProductDetails } from './product-details/product-details';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Registration } from './registration/registration';
import { CommonModule } from '@angular/common';
import { Catalog } from './catalog/catalog';
import { Categories } from './categories/categories';
import { Products } from './products/products';
import { Profile } from './profile/profile';
import { Login } from './profile/login/login';
import { UserDetails } from './profile/user-details/user-details';

@NgModule({
  declarations: [
    App,
    Aboutus,
    Home,
    Navbar,
    Footer,
    Error,
    ProductDetails,
    Registration,
    Catalog,
    Categories,
    Products,
    Profile,
    Login,
    UserDetails,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }


