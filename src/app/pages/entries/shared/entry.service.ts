import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import * as moment from 'moment';
import { DateReturnModel } from 'src/app/shared/models/date-return.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, Entry.fromJson);
  }

  getAllTypesEnum(){
    return this.http.get(this.apiPath + '/typesEnum').pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    );
  }

  getListAllByMonthAndYear(dto: DateReturnModel){
    const dateStart = moment().date(1).month(dto.month - 1).year(dto.year).format('DD-MM-YYYY');
    const dateFinish = moment().month(dto.month - 1).year(dto.year).endOf('month').format('DD-MM-YYYY');

    return this.http.get(this.apiPath + `/dateStart/${dateStart}/dateFinish/${dateFinish}`).pipe(
      map(this.jsonDataToResources.bind(this)),
      catchError(this.handleError)
    );
  }

  create(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  protected setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }

  public getByMonthAndYear(month: number, year: number): Observable<Entry[]>{
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
  }

  private filterByMonthAndYear(entries: Entry[], month: number, year: number){
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const monthMatches = (entryDate.month() + 1) === month;
      const yearMatches = entryDate.year() === year;

      if (monthMatches && yearMatches ){
        return entry;
      }
    });
  }

  public paidEntry(entry: Entry){
    return this.http.put(this.apiPath + '/paid', entry).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError)
    );
  }
}
