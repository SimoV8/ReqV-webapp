import { Component, Input, OnInit, Output } from '@angular/core';
import { Item } from '../item';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-expression-wizard',
  templateUrl: './expression-wizard.component.html',
  styleUrls: ['./expression-wizard.component.css']
})
export class ExpressionWizardComponent implements OnInit {

  _item: Item;
  @Output() itemChanged = new EventEmitter<Item>();
  exprs: string[];

  constructor() { }

  ngOnInit() {

  }

  get item(): Item {
    return this._item;
  }

  @Input()
  set item(item: Item) {
    this.exprs = new Array(item.expressions).map((value, index) => 'exp' + index);
    this._item = item;
    this.update();
    console.log(this.exprs);
  }

  update() {
    // this.exprs[index] = event.target.value;
    this.item.formatText(this.exprs);
    this.itemChanged.emit(this._item);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
