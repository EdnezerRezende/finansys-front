import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesModule } from './pages/categories/categories.module';
import { EntriesModule } from './pages/entries/entries.module';


const routes: Routes = [
  { path: 'categories', loadChildren: './pages/categories/categories.module#CategoriesModule' },
  { path: 'entries', loadChildren: './pages/entries/entries.module#EntriesModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CategoriesModule, EntriesModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
