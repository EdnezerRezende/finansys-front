import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import toastr from 'toastr';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;

  serverErrorMessages: string[] = null;
  submittingForm = false;
  category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if (this.currentAction === 'new'){
      this.createCategory();
    }else {
      this.updateCategory();
    }
  }

  createCategory(){
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      categoria => this.actionsForSuccess(categoria),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(category: Category){
    toastr.success('Solicitação processada com sucesso!');
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar a sua Solicitação');
    this.submittingForm = false;

    if (error.status === 422 ){
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else{
      this.serverErrorMessages = ['Falha na Comunicação com o Servidor, por favor, tente mais tarde!'];
    }
  }

  private updateCategory(){
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      categoria => this.actionsForSuccess(categoria),
      error => this.actionsForError(error)
    );
  }

  private setPageTitle() {
    if (this.currentAction === 'new'){
      this.pageTitle = 'Cadastro de Nova Categoria';
    }else{
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando categoria: ' + categoryName;
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    }else{
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(this.category);
        }, error => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

}
