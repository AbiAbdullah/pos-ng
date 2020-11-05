import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Square } from './model/square';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pos-floor-plan';
  requestId;
  interval;
  squares: Square[] = [];
  squareLeft = 0;
  tableId = 0;
  tables = [];
  shapeList = [{ name: 'Rectangle', value: 'rectangle' }, { name: 'Circle', value: 'circle' }];
  sectionList = [{ name: 'Sec1', value: 'sec1' }, { name: 'Sec2', value: 'sec2' }];
  tableForm = this.fb.group({
    name: ['', Validators.required],
    shape: ['', Validators.required],
    section: ['', Validators.required]
  });
  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }
  ngOnDestroy() {
  }


  addTable() {
    console.log("akdakdkh")
    // this.tableId++;
    // const position = { x: 119, y: 63 };
    // this.tables.push({ id: this.tableId, position });
    if (this.tableForm.valid) {
      this.tables.push(this.tableForm.value);
    }

  }
  onDragEnded(event) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - parentPosition.top));
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

}
