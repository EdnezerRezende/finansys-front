import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryDatabase } from '../in-memory-database';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    RouterModule,
    NgxSpinnerModule
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavbarComponent,
    NgxSpinnerModule

  ]
})
export class CoreModule { }
