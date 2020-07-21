import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource.form/base-resource-form.component';
import { TypeEnum } from '../shared/type.enum';

@Component({
  selector: 'app-entry-form' ,
  templateUrl: './entry-form.component.html' ,
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  categories: Array<Category>;

  typeOptions: Array<TypeEnum>;

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
    this.loadTypesEnum();
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
      type: [1, [Validators.required]],
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

  public loadTypesEnum(){
    this.entryService.getAllTypesEnum().subscribe(types => this.typeOptions = types);
  }
  // get typeOptions(): Array<any> {
  //   return this.entryService.getAllTypesEnum().subscribe(types => types);
  //   // return Object.entries(Entry.types).map(
  //   //   ([value, text]) => {
  //   //     return {
  //   //       text,
  //   //       value
  //   //     };
  //   //   }
  //   // );
  // }

  compareFn( optionOne, optionTwo ): boolean {
    return optionOne.value === optionTwo;
  }
}
