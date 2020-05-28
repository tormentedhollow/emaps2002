import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Inject,EventEmitter,Output, Input   } from '@angular/core';
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
  @Input() childmessage;
  @Input() selected;
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
  sampleImg:any;
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
    if(this.selected){
      //console.log(this.selected);
      //console.log(marker);
      var ct=0;
      var bol=false;
      do{
        //console.log(ct);
        if(this.selected[ct].prjct_id==marker.prjct_id){
          bol=true;
        }
        ct++;
      }while(!bol&&ct<this.selected.length);
      return bol;
    }
    else{
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
    console.log(val);
    console.log(this.v);
    //this.visible(this.v);
  }

  openDialog(id): void {
    console.log(id);
    id.isClicked=true;
    var sts:any;
    this.EmapsService.getStatus(id.prjct_id).subscribe(data => {
      console.log(data);
      if(data==undefined || data==null || data[0] == undefined){
        //this.notificationService.error("Invalid Username or Password");
        console.log("No Status");
        id.isClicked = false;
        this.toClick.nativeElement.click();
      }
      else{
        console.log(data);
        sts = data[0];
        //console.log("../../../../../assets/img/"+sts.prjctsts_imgs+sts.imgs[0]+"/");
        
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '400px',
          height: '500px',
          position: {top: '132px',left: '0px'},
          data: {id: id, sts:sts}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          id.isClicked = false;
          this.toClick.nativeElement.click();
          console.log(id);
        });
      }
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
        // console.log(data);
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
    <p><b>As of {{data.sts.prjctsts_date|date}}</b><br>
        <b>Physical Accomplishment:</b> {{data.sts.physical_acc}}<br>
        <b>Unliqdated Balance:</b> Php {{data.sts.unlqdtd_blnc|number}}.00<br>
        <b>Remarks:</b> {{data.sts.prjctsts_remarks}}<br>
        <b>Recommendation:</b> {{data.sts.prjctsts_rcmmndtn}}<br>
    </p>
    <span *ngIf="data.sts.imgs">
      <img mat-card-image  src="{{img}}" alt="#"><br>
      <div class="row buttons d-flex justify-content-between pad">
        <button mat-raised-button color="primary" (click)="changeImg(-1)" [ngClass]="routeAnimationsElements">Prev</button>
        <button mat-raised-button color="primary" (click)="changeImg(1)" [ngClass]="routeAnimationsElements">Next</button>
      </div>
    </span>
    </mat-card>
  </div>
  <div mat-dialog-actions align="end">
    <button mat-button (click)="onNoClick()" >Ok</button>
  </div>`,
})
export class DialogOverviewExampleDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      //dialogRef.disableClose = true;
    }
    ind=0;
    img="";

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    if(this.data.sts.imgs){
      this.img = "../../../../../assets/img/"+this.data.sts.prjctsts_imgs+"/"+this.data.sts.imgs[this.ind];
      console.log(this.img);
    }
  }
  changeImg(plus){
    this.ind=this.ind+plus;
    if(this.data.sts.imgs.length==this.ind){
      this.ind=0;
    }
    if(this.ind<0){ this.ind = this.data.sts.imgs.length-1;}
    //console.log(this.ind);
    this.img = "../../../../../assets/img/"+this.data.sts.prjctsts_imgs+"/"+this.data.sts.imgs[this.ind];
  }

}