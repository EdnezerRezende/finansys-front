import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { ConfirmationService } from 'primeng/api';
import { DateReturnModel } from 'src/app/shared/models/date-return.model';
import toastr from 'toastr';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  providers: [ConfirmationService]
})
export class EntryListComponent extends BaseResourceListComponent<Entry> implements OnInit {

  buttonLabel = 'Filtrar';
  dateReturnModel: DateReturnModel;

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
        resposta => this.resources = resposta
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

}
