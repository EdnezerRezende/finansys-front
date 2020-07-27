import { OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


import {ConfirmationService} from 'primeng/api';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(
      protected resourceService: BaseResourceService<T>,
      protected confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  protected getList() {
    this.resourceService.getAll().subscribe(
      resposta => this.resources = resposta,
      error => alert('Erro ao carregar a Lista')
    );
  }

  deleteResource(resource: T){
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir este item?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resourceService.delete(resource.id).subscribe(
          () => this.resources = this.resources.filter(item => item !== resource),
          () => alert('Erro ao tentar excluir')
        );
      }
    });
  }
}
