import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddproductComponent } from './components/addproduct/addproduct.component';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { EditproductComponent } from './components/editproduct/editproduct.component';

export const routes: Routes = [
    {
        path:'', component: LoginComponent, pathMatch:'full'
    },
    {
        path:'login', component: LoginComponent
    },
    {
        path:'register', component: RegisterComponent
    },
    {
        path:'dashboard', component: DashboardComponent,
        children: [
            {
                path:'addproduct', component:AddproductComponent
            },
            {
                path:'productlist', component:ProductlistComponent
            },
            {
                path:'editproduct/:id', component:EditproductComponent
            }
        ]
    }
];
