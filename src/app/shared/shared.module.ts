import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { RouterModule } from '@angular/router';

import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';
import { ActionsLinksTableComponent } from './components/actions-links-table/actions-links-table.component';
import { SelectMonthYearComponent } from './components/select-month-year/select-month-year.component';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    ActionsLinksTableComponent,
    SelectMonthYearComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ConfirmDialogModule,
    InputNumberModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    ActionsLinksTableComponent,
    ConfirmDialogModule,
    SelectMonthYearComponent,
    InputNumberModule
  ]
})
export class SharedModule { }
