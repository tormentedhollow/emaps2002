import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Inject,EventEmitter,Output   } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {EmapsService} from '../../../../services/emaps.service'
import { from } from 'rxjs';
import { visitAll } from '@angular/compiler';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {  animal: string;
  name: string;
}

@Component({
  selector: 'anms-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapComponent implements OnInit {
  @ViewChild('toClick',{static: true}) toClick:ElementRef; 
  // @Output() myGroupChanged: EventEmitter<number> =   new EventEmitter();
  init=0;
  v=false;
  ctr=0;
  ctr2=0;
  latitude = 9.13423599192499;
  longitude = 125.45977147832036;
  mapType = 'hybrid';
  rowData: any;
  year: any;
  category: any;
  locs: any;
  ic: any;
  pre_val = {year_fndd:true,ctgry_id:true};
  myGroup = new FormGroup({
    year_fndd: new FormControl(),
    ctgry_id: new FormControl(),
    region: new FormControl(),
    province: new FormControl(),
    mun_city: new FormControl()
 });

  iconBase = '../../../../../assets/ic/';
 icons = {
  1: {
    icon: this.iconBase+ 'fmr.png'
  },
  2: {
    icon: this.iconBase + 'irrig.png'
  },
  3: {
    icon: this.iconBase + 'phf.png'
  },
  4: {
    icon: this.iconBase + 'others.png'
  }
};
 
  constructor( private EmapsService: EmapsService, public dialog: MatDialog) { }

  selectedMarker;
  markers : any;
  // markers = [
  //   // These are all just random coordinates from https://www.random.org/geographic-coordinates/
  //   { lat: 10.098889, lng: 125.575278},
  //   { lat: 8.034847, lng: 126.062845, alpha: 1 },
  //   { lat: 8.561484, lng: 125.816786, alpha: 1 },
  // ];

  addMarker(lat: number, lng: number) {
    this.markers.push({ lat, lng, alpha: 1});
  }

  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType]));
  }

  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType]));
  }

  selectMarker(event) {
    this.selectedMarker = {
      lat: event.latitude,
      lng: event.longitude
    };
  }
  find_prov(prov,region){
    return region.toString().slice(0,2) == prov.code.toString().slice(0,2);
  }
  find_mun_city(mun_city,prov){
    return prov.toString().slice(0,4) == mun_city.code.toString().slice(0,4);
  }
  find_bar(bar,mun_city){
    return mun_city.toString().slice(0,6) == bar.code.toString().slice(0,6);
  }

  sample(){
    //console.log("sample");
  }
  visible(marker,i){
    //console.log(this.myGroup.value);
    // if()
    var yr = this.myGroup.value.year_fndd==marker.year_fndd||this.myGroup.value.year_fndd==null ||this.myGroup.value.year_fndd=="all";
    var ctgry = this.myGroup.value.ctgry_id==marker.ctgry_id||this.myGroup.value.ctgry_id==null ||this.myGroup.value.ctgry_id=="all";
    
    var prov = true;
    var mun = true;
    if(this.myGroup.value.province!=undefined && marker.lctn_str!=undefined){
      var v_p = this.myGroup.value.province.toString().substring(0,5);
      var m_p = marker.lctn_str.toString().substring(0,5);
      prov = v_p==m_p||this.myGroup.value.province==null ||this.myGroup.value.province=="all";
      var v_m;
      if(this.myGroup.value.mun_city!=undefined)
        v_m = this.myGroup.value.mun_city.toString();
      var m_m = marker.lctn_str.toString();
      mun = v_m==m_m||this.myGroup.value.mun_city==null ||this.myGroup.value.mun_city=="all";
    }
    if(yr && ctgry && prov && mun) this.ctr2++;
    
    //console.log(i+" - "+this.markers.length)
    if(i==this.markers.length-1){ 
      this.ctr = this.ctr2; 
      this.ctr2=0; 
    }
    return yr && ctgry && prov && mun;
  }
  onMapReady(){
    //console.log(this.toClick);
    this.EmapsService.getProjects().subscribe(data => {
      if(data==undefined || data==null){
        //this.notificationService.error("Invalid Username or Password");
      }
      else{
        this.markers = data;
        this.init=1;
        //console.log(this.markers);
        this.toClick.nativeElement.click();
      }
    });
  }
  setvisible(){
    var val = this.myGroup.value;
    val.year_fndd;
    val.ctgry_id;
    this.v = !this.v;
    //this.visible(this.v);
  }

  openDialog(id): void {
    console.log(id);
    id.isClicked=true;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      height: '500px',
      position: {top: '132px',left: '0px'},
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      id.isClicked = false;
      this.toClick.nativeElement.click();
      console.log(id);
    });
  }

  ngOnInit() {
    this.EmapsService.getYear().subscribe(data => {
      if(data==undefined || data==null){
      }
      else{
        this.year = data;
      }
    });
    this.EmapsService.getCategory().subscribe(data => {
      if(data==undefined || data==null){
      }
      else{
        this.category = data;
      }
    });
    this.EmapsService.getLocs().subscribe(data => {
      if(data==undefined || data==null){
      }
      else{
        this.locs = data;
      }
    });
    this.EmapsService.getIc().subscribe(data => {
      if(data==undefined || data==null){
      }
      else{
        this.ic = data;
        console.log(data);
      }
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  styles: [`mat-card img{
              height: 220px;
  }`],
  template: `<div mat-dialog-title><h2 >Project Information <button type="button" mat-fab color="primary" class="add" cdkFocusInitial><fa-icon icon="search"></fa-icon></button></h2></div>
  <div mat-dialog-content>
    <p>
      <b>Title: </b>{{data.id.prjct_title}}<br>
      <b>Recipient: </b>{{data.id.prjct_recipient}}<br>
      <b>Location: </b>{{data.id.str}} (<i>{{data.id.lat}} , {{data.id.lng}}</i>)<br>
      <b>Year Funded: </b>{{data.id.year_fndd}}<br>
      <b>Fund Source: </b>{{data.id.fund_src}}<br>
      <b>Cost: </b>Php {{data.id.cost|number}}.00<br>
    </p>
    <h3>Status</h3>
    <mat-card>
    <p><b>As of January 1, 2020</b><br>
        <b>Physical Accomplishment:</b> 15 has<br>
        <b>Unliqdated Balance:</b> Php 0.00<br>
        <b>Remarks:</b> Sample Remarks<br>
        <b>Recommendation:</b> Sample Recommendation<br>
    </p>
    <img mat-card-image  src="../../../../../assets/intro.jpg" alt="{{data.id.prjct_title}}">
    </mat-card>
  </div>
  <div mat-dialog-actions align="end">
    <button mat-button (click)="onNoClick()" >Ok</button>
  </div>`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      //dialogRef.disableClose = true;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}