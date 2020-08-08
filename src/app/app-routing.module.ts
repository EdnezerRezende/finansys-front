import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesModule } from './pages/categories/categories.module';
import { EntriesModule } from './pages/entries/entries.module';
import { ReportsModule } from './pages/reports/reports.module';
import { LoginComponent } from './pages/login/login.component';
import { LoginModule } from './pages/login/login.module';


const routes: Routes = [
  { path: '', redirectTo: 'entries', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'reports', loadChildren: './pages/reports/reports.module#ReportsModule' },
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' },
  { path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), LoginModule, EntriesModule, ReportsModule, CategoriesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
