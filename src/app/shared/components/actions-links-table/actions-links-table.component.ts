import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-actions-links-table',
  templateUrl: './actions-links-table.component.html',
  styleUrls: ['./actions-links-table.component.css']
})
export class ActionsLinksTableComponent implements OnInit {
  @Output() deleteResourceFn = new EventEmitter();
  @Output() paidReturn = new EventEmitter();
  @Input() allowPaid = false;
  @Input() resourceComp: any;
  constructor(protected confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  public deleteResource(resource) {
    this.deleteResourceFn.emit(resource);
  }

  public paid(resource){
    this.confirmationService.confirm({
      message: 'Efetuou o Pagamento?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.paidReturn.emit(resource);
      }
    });
  }
}
