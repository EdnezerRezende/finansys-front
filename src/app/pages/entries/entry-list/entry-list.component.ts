import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { element } from 'protractor';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      resposta => this.entries = resposta,
      error => alert('Erro ao carregar a Lista')
    );
  }

  deleteEntry(entry: Entry){
    const mustDelete = confirm('Deseja realmente excluir este item?');
    if (mustDelete){
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(item => item !== entry),
        () => alert('Erro ao tentar excluir')
      );
    }
  }
}
