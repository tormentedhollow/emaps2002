import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'anms-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    autosave: false,
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    prct_title: ['', [Validators.required]],
    recipient: ['', [Validators.required]],
    location: ['', [Validators.required]],
    lat: ['', [Validators.required]],
    lng: ['', [Validators.required]],
    year_fndd: ['', [Validators.required]],
    fund_src: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    prjct_ctgry_id: ['', [Validators.required]],
    sub_cat: ['', [Validators.required]],
    
  });

  columnDefs = [
    {headerName: 'Make', field: 'make' },
    {headerName: 'Model', field: 'model' },
    {headerName: 'Price', field: 'price'}
];

rowData = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 },
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 },
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 },
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 }
];
  
  constructor(private fb: FormBuilder,) {}

  ngOnInit() {
  }

  save(form){
    console.log(form);
  }

  clear(){
    console.log("clear");
  }

}
