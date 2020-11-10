import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Square } from './model/square';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('closebuttonOfTableModal') closebuttonOfTableModal;
  title = 'pos-floor-plan';
  requestId;
  interval;
  squares: Square[] = [];
  squareLeft = 0;
  tableId = 0;
  tables = [];
  selectedTableIndex = null;
  shapeList = [{ name: 'Rectangle', value: 'rectangle' }, { name: 'Circle', value: 'circle' }];
  sectionList = [{ name: 'Sec1', value: 'sec1' }, { name: 'Sec2', value: 'sec2' }];
  tableForm = this.fb.group({
    name: ['', Validators.required],
    shape: ['', Validators.required],
    section: ['', Validators.required],
    position: this.fb.group({
      x: [0.5],
      y: [0.5]
    })
  });
  bgImageUrl: any = 'https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/68801361/original/a225c7bdb8b901bbfe07bd81f020e89a9d4f4ce7/draw-2d-floor-plans-in-autocad-from-sketches-image-or-pdf.jpg';
  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }
  ngOnDestroy() {
  }


  addTable() {
    if (this.tableForm.valid) {
      if (this.selectedTableIndex !== null) {
        this.tables[this.selectedTableIndex] = this.tableForm.value;
      } else {
        this.tables.push(this.tableForm.value);
      }
      this.resetForm();
      this.closebuttonOfTableModal.nativeElement.click();
    }

  }
  onDragEnded(event, table) {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);
    const position = {
      x: (boundingClientRect.x - parentPosition.left),
      y: (boundingClientRect.y - parentPosition.top)
    };
    table.position = position;
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
  setTable(table, indexNo) {
    this.selectedTableIndex = indexNo;
    this.tableForm.setValue(table);
  }
  closeTable() {
    this.resetForm();
  }
  resetForm() {
    this.selectedTableIndex = null;
    this.tableForm.reset();
    this.tableForm.get('position').setValue({ x: 0.5, y: 0.5 });
  }
  onSelectFile(event) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          const imageUrl = reader.result;
          this.bgImageUrl = reader.result;
        };
      }
    }
  }
}
