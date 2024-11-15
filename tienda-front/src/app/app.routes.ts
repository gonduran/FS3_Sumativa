import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
//auth
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { RegisterComponent } from './auth/register/register.component';
//user
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ListUserComponent } from './user/list-user/list-user.component';
//product
import { AddProductComponent } from './product/add-product/add-product.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'cart', component: CartComponent },
    { path: 'home', component: HomeComponent },
    { path: 'product-catalog', component: ProductCatalogComponent },
    { path: 'product-detail/:title', component: ProductDetailComponent },
    //auth
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'recover-password', component: RecoverPasswordComponent },
    { path: 'register', component: RegisterComponent },
    //user
    { path: 'add-user', component: AddUserComponent },
    { path: 'edit-user/:id', component: EditUserComponent },
    { path: 'list-user', component: ListUserComponent },
    //product
    { path: 'add-product', component: AddProductComponent },
    { path: 'edit-product', component: EditProductComponent },
    { path: 'list-product', component: ListProductComponent }
];
