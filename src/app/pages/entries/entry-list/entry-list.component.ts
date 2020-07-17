import { Component } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css'],
  providers: [ConfirmationService]
})
export class EntryListComponent extends BaseResourceListComponent<Entry> {

  constructor(
    protected entryService: EntryService,
    protected confirmationService: ConfirmationService
  ) {
    super(entryService, confirmationService);
  }

}
