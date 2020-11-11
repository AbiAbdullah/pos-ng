import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Floorplan } from './model/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('closebuttonOfTableModal') closebuttonOfTableModal;
  @ViewChild('closebuttonOfFloorplanModal') closebuttonOfFloorplanModal;
  @ViewChild('closebuttonOfSectionModal') closebuttonOfSectionModal;
  title = 'pos-floor-plan';
  floorplans: Floorplan[] = [];
  selectedFloorplan: Floorplan = null;
  selectedTableIndex = null;
  selectedTable = null;
  shapeList = [{ name: 'Rectangle', value: 'rectangle' }, { name: 'Circle', value: 'circle' }];
  sectionList = [{ name: 'Sec1', value: 'sec1' }, { name: 'Sec2', value: 'sec2' }];

  sectionForm = this.fb.group({
    name: ['', Validators.required],
    value: ['', Validators.required]
  });
  floorplanForm = this.fb.group({
    name: ['', Validators.required],
    image: ['', Validators.required]
  });
  tableForm = this.fb.group({
    name: ['', Validators.required],
    shape: ['', Validators.required],
    section: ['', Validators.required],
    currentPosition: this.fb.group({
      x: [0.5],
      y: [0.5]
    }),
    position: this.fb.group({
      x: [0.5],
      y: [0.5]
    })
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

  }
  ngOnDestroy() {
  }

  createSection() {
    if (this.sectionForm.valid) {
      this.sectionList.push(this.sectionForm.value);
      this.closebuttonOfSectionModal.nativeElement.click();
      this.sectionForm.reset();
    }
  }

  createFloorplan() {
    if (this.floorplanForm.valid) {
      const floorplan: Floorplan = this.floorplanForm.value;
      floorplan.tables = [];
      this.floorplans.push(floorplan);
      this.closebuttonOfFloorplanModal.nativeElement.click();
      this.floorplanForm.reset();
    }
  }

  addTable() {
    if (this.tableForm.valid) {
      if (this.selectedTableIndex !== null) {
        const currentPosition = this.tableForm.get('currentPosition').value;
        this.selectedFloorplan.tables[this.selectedTableIndex] = this.tableForm.value;
        this.selectedFloorplan.tables[this.selectedTableIndex].position = currentPosition;
      } else {
        this.selectedFloorplan.tables.push(this.tableForm.value);
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
    table.currentPosition = position;
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
          this.floorplanForm.get('image').setValue(imageUrl);
        };
      }
    }
  }
}
