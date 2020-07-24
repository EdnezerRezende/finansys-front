import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;

  serverErrorMessages: string[] = null;
  submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  ptBR = {
    closeText: 'Fechar' ,
    prevText: 'Anterior' ,
    nextText: 'Próximo' ,
    // currentText: 'Começo' ,
    monthNames: ['Janeiro' , ' Fevereiro' , ' Março' , ' Abril' , ' Maio' , ' Junho' ,
    'Julho' , ' Agosto' , ' Setembro' , ' Outubro' , ' Novembro' , ' Dezembro'],
    monthNamesShort: ['Jan' , ' Fev' , ' Mar' , ' Abr' , ' Mai' , ' Jun' , 'Jul' , ' Ago' , ' Set' , ' Out' , ' Nov' , ' Dez'],
    dayNames: ['Domingo' , ' Segunda' , ' Terça' , ' Quarta' , ' Quinta' , ' Sexta' , ' Sábado'],
    dayNamesShort: ['Dom' , ' Seg' , ' Ter' , ' Qua' , ' Qui' , ' Sex' , ' Sáb'],
    dayNamesMin: ['D' , ' S' , ' T' , ' Q' , ' Q' , ' S' , ' S'],
    weekHeader: 'Semana' ,
    firstDay: 1,
    isRTL: false,
    today: 'Hoje',
    clear: 'Limpar',
    showMonthAfterYear: false,
    yearSuffix: '' ,
    timeOnlyTitle: 'Só Horas' ,
    timeText: 'Tempo' ,
    hourText: 'Hora' ,
    minuteText: 'Minuto' ,
    secondText: 'Segundo' ,
    currentText: 'Data Atual',
    ampm: false,
    month: 'Mês' ,
    week: 'Semana' ,
    day: 'Dia' ,
    allDayText : 'Todo Dia'
  };

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T
  ) {
      this.route = this.injector.get(ActivatedRoute);
      this.router = this.injector.get(Router);
      this.formBuilder = this.injector.get(FormBuilder);
   }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if (this.currentAction === 'new'){
      this.createResource();
    }else {
      this.updateResource();
    }
  }

  createResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource).subscribe(
      resposta => this.actionsForSuccess(resposta),
      error => this.actionsForError(error)
    );
  }

  protected updateResource(){
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource).subscribe(
      resposta => this.actionsForSuccess(resposta),
      error => this.actionsForError(error)
    );
  }

  protected actionsForSuccess(resource: T){
    toastr.success('Solicitação processada com sucesso!');

    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }

  protected actionsForError(error){
    this.submittingForm = false;
  }

  protected setPageTitle() {
    if (this.currentAction === 'new'){
      this.pageTitle = this.creationPageTitle();
    }else{
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string{
    return 'Novo';
  }

  protected editionPageTitle(): string {
      return 'Edição';
  }

  protected setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    }else{
      this.currentAction = 'edit';
    }
  }

  protected loadResource() {
    if (this.currentAction === 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        }, error => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

  protected abstract buildResourceForm(): void;

}
