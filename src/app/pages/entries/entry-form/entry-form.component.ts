import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form' ,
  templateUrl: './entry-form.component.html' ,
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;

  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '' ,
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ' , '
  };

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
  }
  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categorieService: CategoryService
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    if (this.currentAction === 'new'){
      this.createEntry();
    }else {
      this.updateEntry();
    }
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
  createEntry(){
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      lancamento => this.actionsForSuccess(lancamento),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry){
    toastr.success('Solicitação processada com sucesso!');
    this.router.navigateByUrl('entries' , {skipLocationChange: true}).then(
      () => this.router.navigate(['entries' , entry.id, 'edit'])
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

  private updateEntry(){
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry).subscribe(
      lancamento => this.actionsForSuccess(lancamento),
      error => this.actionsForError(error)
    );
  }

  private setPageTitle() {
    if (this.currentAction === 'new'){
      this.pageTitle = 'Cadastro de Novo Lançamento';
    }else{
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando lançamento: ' + entryName;
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    }else{
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry);
        }, error => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

  loadCategories(){
    this.categorieService.getAll().subscribe(
      resposta => this.categories = resposta
    );
  }

}
