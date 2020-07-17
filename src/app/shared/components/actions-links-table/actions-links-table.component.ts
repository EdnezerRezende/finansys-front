import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actions-links-table',
  templateUrl: './actions-links-table.component.html',
  styleUrls: ['./actions-links-table.component.css']
})
export class ActionsLinksTableComponent implements OnInit {
  @Output() deleteResourceFn = new EventEmitter();
  @Input() resourceComp: any;

  constructor() { }

  ngOnInit(): void {
  }

  public deleteResource(resource) {
    this.deleteResourceFn.emit(resource);
  }

}
