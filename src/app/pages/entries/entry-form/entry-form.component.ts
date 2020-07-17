import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource.form/base-resource-form.component';

@Component({
  selector: 'app-entry-form' ,
  templateUrl: './entry-form.component.html' ,
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '' ,
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    protected entryService: EntryService,
    protected injector: Injector,
    protected categoryService: CategoryService
  ) {
    super(injector, new Entry(), entryService, Entry.fromJson);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCategories();
  }

  protected creationPageTitle(): string{
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const entryName = this.resource.name || '';
    return 'Editando lançamento: ' + entryName;
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [false, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  loadCategories(){
    this.categoryService.getAll().subscribe(
      resposta => this.categories = resposta
    );
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text,
          value
        };
      }
    );
  }
}
