import { NgModule } from '@angular/core';
import { GuardService } from './service/guard/guard.service'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule,)
  },
  {
    path: 'reserve',
    loadChildren: () => import('./pages/reserve/reserve.module').then( m => m.ReservePageModule),
    canActivate: [GuardService]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
