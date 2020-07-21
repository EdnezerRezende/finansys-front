import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter, Input } from '@angular/core';
import { MonthEnum } from '../../models/month.enum';

import * as moment from 'moment';
import { DateReturnModel } from '../../models/date-return.model';

@Component({
  selector: 'app-select-month-year',
  templateUrl: './select-month-year.component.html',
  styleUrls: ['./select-month-year.component.css']
})
export class SelectMonthYearComponent implements OnInit {

  mesesSelection = Object.values(MonthEnum);
  anosSelection = new Array<number>();

  @Input() buttonLabel = '';
  @Output() returnButtonClick = new EventEmitter();
  @Output() returnYear = new EventEmitter();

  @ViewChild('month', {static: false}) month: ElementRef = null;
  @ViewChild('year', {static: false}) year: ElementRef = null;

  constructor() { }

  ngOnInit(): void {
    this.gerarAnos();
  }

  gerarAnos(){
    const anoAntiga = Number(moment().subtract(3, 'year').format('yyyy'));
    const anoAtual = Number(moment().add(4, 'year').format('yyyy'));
    for (let i = anoAntiga; i < anoAtual; i++){
      this.anosSelection.push(i);
    }
  }

  buttonClick(){
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if ( !month || !year ){
      alert('Necessário informar o Mês e o Ano!');
    }else{
      const dto = new DateReturnModel();
      dto.month = Number(month);
      dto.year = Number(year);
      this.returnButtonClick.emit(dto);
    }
  }
}
