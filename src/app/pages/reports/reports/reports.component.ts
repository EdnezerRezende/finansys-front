import { Component, OnInit } from '@angular/core';
import { MonthEnum } from 'src/app/shared/models/month.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  pageTitle = 'Relatório de Receitas e Despesas';
  mesesSelection = Object.values(MonthEnum);
  anosSelection = new Array<number>();

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

  generateReports(){

  }
}
