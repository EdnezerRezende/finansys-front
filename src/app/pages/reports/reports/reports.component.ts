import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MonthEnum } from 'src/app/shared/models/month.enum';
import * as moment from 'moment';
import { Category } from '../../categories/shared/category.model';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';
import { CategoryService } from '../../categories/shared/category.service';
import currencyFormatter from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  pageTitle = 'Relatório de Receitas e Despesas';
  mesesSelection = Object.values(MonthEnum);
  anosSelection = new Array<number>();

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month', {static: false}) month: ElementRef = null;
  @ViewChild('year', {static: false}) year: ElementRef = null;

  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    this.gerarAnos();

    this.categoryService.getAll()
      .subscribe( categories => this.categories = categories);
  }

  gerarAnos(){
    const anoAntiga = Number(moment().subtract(3, 'year').format('yyyy'));
    const anoAtual = Number(moment().add(4, 'year').format('yyyy'));
    for (let i = anoAntiga; i < anoAtual; i++){
      this.anosSelection.push(i);
    }
  }

  generateReports(){
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if ( !month || !year ){
      alert('Necessário informar o Mês e o Ano para gerar os Relatórios!');
    }else{
      this.entryService.getByMonthAndYear(Number(month), Number(year))
        .subscribe(this.setValues.bind(this));
    }
  }

  private setValues(entries: Entry[]){
    this.entries = entries;
    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance(){
    let expenseTotal = 0;
    let revenueTotal = 0;
    this.expenseTotal = 0;
    this.revenueTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type === 'revenue'){
        revenueTotal += currencyFormatter.unformat(entry.amount, {code: 'BRL'});
      }else{
        expenseTotal += currencyFormatter.unformat(entry.amount, {code: 'BRL'});
      }
    });

    this.expenseTotal = currencyFormatter.format(expenseTotal, {code: 'BRL'});
    this.revenueTotal = currencyFormatter.format(revenueTotal, {code: 'BRL'});
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, {code: 'BRL'});
  }

  private setChartData(){
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Receitas', '#9CCC65');
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string){

    const chartData = [];

    this.categories.forEach(category => {
      const filteredEntries = this.entries.filter(
        entry => (entry.categoryId === category.id) && (entry.type === entryType)
      );

      if (filteredEntries.length > 0){
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL'}), 0
        );

        chartData.push({
          categoryName: category.name,
          totalAmount
        });
      }
    });

    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        // data: [6544, 54545]
        data: chartData.map(item => item.totalAmount)
      }]
    };
  }
}
