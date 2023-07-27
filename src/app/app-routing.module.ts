import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth-admin.guard';
import { AuthGuard } from './auth.guard';
// import { CusGuard } from './cus.guard';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
 {
    path : 'home',canActivate:[AuthGuard],
    loadChildren:()=>import('./client/client.module').then(m => m.ClientModule)
  },
  {
    path : 'admin',canActivate:[AdminGuard],
    loadChildren:()=>import('./admin/admin.module').then(m => m.AdminModule)
  },
  {path: '',component:LoginComponent},
  {path: 'login',component:LoginComponent},
  {path: 'admin/login',component:LoginAdminComponent},
  {path: '**',component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
