import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesModule } from './pages/categories/categories.module';
import { EntriesModule } from './pages/entries/entries.module';
import { ReportsModule } from './pages/reports/reports.module';


const routes: Routes = [
  { path: '', redirectTo: 'reports', pathMatch: 'full'},
  { path: 'reports', loadChildren: './pages/reports/reports.module#ReportsModule' },
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' },
  { path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReportsModule, CategoriesModule, EntriesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
