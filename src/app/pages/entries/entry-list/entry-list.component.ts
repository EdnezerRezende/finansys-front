import { Component, OnInit, ViewChild } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { ConfirmationService } from 'primeng/api';
import { DateReturnModel } from 'src/app/shared/models/date-return.model';
import toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  providers: [ConfirmationService]
})
export class EntryListComponent extends BaseResourceListComponent<Entry> implements OnInit {

  buttonLabel = 'Filtrar';
  dateReturnModel: DateReturnModel;
  categories: Category[] = new Array<Category>();

  @ViewChild('dt') table: Table;

  constructor(
    protected entryService: EntryService,
    protected confirmationService: ConfirmationService
  ) {
    super(entryService, confirmationService);
  }

  ngOnInit(){
    this.getListAll(null);
  }

  getListAll(dto: DateReturnModel){
    if (dto === null){
      this.getList();
    }else{
      this.dateReturnModel = dto;
      this.entryService.getListAllByMonthAndYear(dto).subscribe(
        resposta => {
          this.resources = resposta;
          const cats = new Array<Category>();

          this.resources.forEach(entry => {
            cats.push(entry.category);
          });

          const seem = {};
          this.categories = cats.filter(item => {
            if (seem.hasOwnProperty(item.id)){
              return false;
            }else{
              seem[item.id] = true;
              return true;
            }
          });

          this.categories = this.categories.sort((a, b) => {
            if (a.name > b.name){
              return 1;
            }
            if (a.name < b.name){
              return -1;
            }

            return 0;
          });
          console.log('this.categories');
          console.log(this.categories);
        }
      );
    }

  }

  paid(resource: Entry){
    console.log(resource);
    this.entryService.paidEntry(resource).subscribe(
      resposta => {
        toastr.success(`Valor de ${resource.amount} pago com sucesso!`);
        this.resources.forEach(item => {
          if (item.id === resource.id){
            item.paid = true;
          }
        });
      },
      error => {
        console.log(error);
        toastr.error(`Ocorreu um erro, tente novamente mais tarde!`);
      }
    );
  }

  selectCategory(event) {
    this.table.filter(event.value, 'category.id', 'equals');
  }

  selectStatus(event) {
    this.table.filter(event.value, 'paid', 'equals');
  }
}
