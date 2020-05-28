import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, NotificationService } from '../../../core/core.module';
import { Validators, FormBuilder } from '@angular/forms';
import {EmapsService} from '../../../services/emaps.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {  FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'anms-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EntryComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  rowData: any;
  category: any;
  subcat: any;
  year: any;
  selected:any;
  locs: any;
  form_val:any;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  form = this.fb.group({
    autosave: false,
    prct_title: ['', [Validators.required]],
    recipient: ['', [Validators.required]],
    lat: ['', [Validators.required]],
    lng: ['', [Validators.required]],
    year_fndd: ['', [Validators.required]],
    fund_src: ['', [Validators.required]],
    cost: ['', [Validators.required]],
    prjct_ctgry_id: ['', [Validators.required]],
    sub_cat: ['', [Validators.required]],
    prov: ['', [Validators.required]],
    mun: ['', [Validators.required]],
    bar: ['', [Validators.required]],
    
  });

  dataentry=1;
  columnDefs = [
    {headerName: "ID", field: "prjct_id", sortable: true,minWidth: 80,},
    {headerName: "Project Category", field: "ctgry_desc", sortable: true,minWidth: 100,},
    {headerName: "Project Sub-Category", field: "desc", sortable: true,minWidth: 150,},
    {headerName: "Project Title", field: "prjct_title", sortable: true,minWidth: 150,},
    {headerName: "Fund Source", field: "fund_src", sortable: false,minWidth: 70,},
    {headerName: "Year Funded", field: "year_fndd", sortable: false,minWidth: 70,},
    {headerName: "Province", field: "prov", sortable: true,minWidth: 120,},
    {headerName: "Municipality", field: "mun", sortable: false,minWidth: 120,},
    {headerName: "Barangay", field: "brgy", sortable: false,minWidth: 120,},
    {headerName: "Recipient", field: "prjct_recipient", suppressMenu: true,minWidth: 120,},
    {headerName: "Cost", field: "cost", sortable: false,minWidth: 120,},
    
];
defaultColDef = {
  flex: 1,
  minWidth: 200,
  filter: true,
  sortable: true,
  resizable: true,
};
autoGroupColumnDef = { minWidth: 200 };
rowSelection='multiple';

  
  constructor(private fb: FormBuilder,private EmapsService: EmapsService, public dialog: MatDialog, private readonly notificationService: NotificationService) {}

  ngOnInit() {
  this.year = [];
  var ii = this.year.length;
  for(var i= new Date().getFullYear();i >= 2010; i--){ this.year[ii] = i; ii++}
  // console.log(this.year);
  this.EmapsService.getProjects().subscribe(data => {
    this.rowData = data;
    //console.log(data);
  });

  this.EmapsService.getSubCat().subscribe(data => {
    this.subcat = data;
    // console.log(this.subcat);
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
      // console.log(this.locs[1]);
    }
  });

  
  }

  find_mun_city(mun_city,prov){
    return prov.toString().slice(0,4) == mun_city.code.toString().slice(0,4);
  }
  find_bar(bar,mun_city){
    return mun_city.toString().slice(0,6) == bar.code.toString().slice(0,6);
  }

  refreshtable(){
    this.EmapsService.getProjects().subscribe(data => {
      this.rowData = data;
      //console.log(data);
      this.gridApi.setRowData(this.rowData);
      this.gridApi.refreshClientSideRowModel('group');
    });

  }

  save(form){
    this.form_val = form.value;
    console.log(form);
    this.form.reset();
    this.form_val['str']= this.titleCase(this.locs[3].find(x=> x.code == this.form_val.bar).name+", "+this.locs[2].find(x=> x.code == this.form_val.mun).name+", "+this.locs[1].find(x=> x.code == this.form_val.prov).name);
    console.log(this.form_val);
    this.EmapsService.insertProject(this.form_val).subscribe(data => {
      if(data==undefined || data==null){
        
        this.notificationService.info('Data null!');
      }
      else{
        //this.locs = data;
        // console.log(this.locs[1]);
        console.log(data);
        this.refreshtable();
        this.notificationService.success('New project successfully added!');
      }
    });
  }

  openAddStatus(val){
    console.log(val);
        
        const dialogRef = this.dialog.open(DialogStatusExampleDialog, {
          width: '800px',
          height: 'auto',
          //position: {top: '132px',left: '0px'},
          data: {id: val.data}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
  }

  findSub(sub,cat){
    return sub == parseInt(cat);
  }

  titleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
  clear(){
    //console.log("clear");
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;


        // this.rowData = [{"prjct_id":16000058,"athlete":"Michael Phelps","age":23,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":8,"silver":0,"bronze":0,"total":8},
        // {"prjct_id":16000059,"athlete":"Michael Phelps","age":19,"country":"United States","year":2004,"date":"29/08/2004","sport":"Swimming","gold":6,"silver":0,"bronze":2,"total":8},
        // {"prjct_id":16000051,"athlete":"Michael Phelps","age":27,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":2,"bronze":0,"total":6},
        // {"prjct_id":16000052,"athlete":"Natalie Coughlin","age":25,"country":"United States","year":2008,"date":"24/08/2008","sport":"Swimming","gold":1,"silver":2,"bronze":3,"total":6},
        // {"prjct_id":16000053,"athlete":"Aleksey Nemov","age":24,"country":"Russia","year":2000,"date":"01/10/2000","sport":"Gymnastics","gold":2,"silver":1,"bronze":3,"total":6},
        // {"prjct_id":16000054,"athlete":"Alicia Coutts","age":24,"country":"Australia","year":2012,"date":"12/08/2012","sport":"Swimming","gold":1,"silver":3,"bronze":1,"total":5},
        // {"prjct_id":16000055,"athlete":"Missy Franklin","age":17,"country":"United States","year":2012,"date":"12/08/2012","sport":"Swimming","gold":4,"silver":0,"bronze":1,"total":5},];
  }

  onSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    console.log(selectedRows);
    this.selected = selectedRows;
  }

}


@Component({
  selector: 'dialog-status-example-dialog',
  styles: [`mat-card img{
              height: 220px;
  }`],
  template: `<div mat-dialog-title><h2 >Project Status <button type="button" mat-fab color="primary" class="add" cdkFocusInitial><fa-icon icon="pen"></fa-icon></button></h2></div>
  <div mat-dialog-content>
    <p>
      <b>Title: </b>{{data.id.prjct_title}}<br>
      <b>Recipient: </b>{{data.id.prjct_recipient}}<br>
      <b>Location: </b>{{data.id.str}} (<i>{{data.id.lat}} , {{data.id.lng}}</i>)<br>
      <b>Year Funded: </b>{{data.id.year_fndd}}<br>
      <b>Fund Source: </b>{{data.id.fund_src}}<br>
      <b>Cost: </b>Php {{data.id.cost|number}}.00<br>
    </p>
    <h3>Update Status</h3>
    <div class="row">
      <mat-form-field class="col" >
        <input matInput type="date" [(ngModel)]="date" placeholder="Status as of *"  (change)="changeUrl()">
      </mat-form-field>
      <mat-form-field class="col" >
        <input matInput type="number" [(ngModel)]="balance" placeholder="Unliquidated Balance *" >
      </mat-form-field>
      <mat-form-field class="col" >
        <input matInput [(ngModel)]="accomp"  placeholder="Accomplishment *" >
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field class="col" >
        <textarea matInput  [(ngModel)]="remarks"  placeholder="Remarks/Observation/Feedback"></textarea>
      </mat-form-field>
      <mat-form-field class="col" >
        <textarea matInput  [(ngModel)]="analysis"  placeholder="Analysis/Recommendation"></textarea>
      </mat-form-field>
    </div>
    
  </div>
  <div class="container">
    <div class="buttons">
      <button mat-raised-button (click)="fileInput2.click()"> Choose File</button>
      <mat-list dense *ngIf="files!=undefined">
        <span *ngFor="let item of files"> {{item.name}}; </span>
      </mat-list>
    </div>
    <input hidden (change)="changeUrl()" (click)="onFileSelected()" type="file" id="file" name="file" #fileInput2  ng2FileSelect [uploader]="uploader" accept="image/x-png,image/gif,image/jpeg" multiple/>
    <!--<button type="button" class="btn btn-success btn-s" 
      (click)="uploader.uploadAll()" 
      [disabled]="!uploader.getNotUploadedItems().length" >
          Upload
    </button>-->
  </div>
  <div mat-dialog-actions class="row buttons d-flex justify-content-between pad">
    <button mat-button (click)="onNoClick()" >Cancel</button>
    <button type="submit" mat-raised-button color="primary" (click)="save()"  
    [disabled]="!uploader.getNotUploadedItems().length || date==undefined || date=='' || balance==undefined || accomp==undefined || accomp=='' || remarks==undefined || remarks==''  || analysis==undefined || analysis==''">
      Save
    </button>
  </div>
 `,
})
export class DialogStatusExampleDialog implements OnInit {

  uploadAPIOrg = 'http://localhost:6277/api/upload';
  uploadAPI = 'http://localhost:6277/api/upload';
  public uploader: FileUploader = new FileUploader({ url: this.uploadAPI, itemAlias: 'file' });
  srcResult:any;
  file: any
  files=[];
  date: any;
  balance: any;
  accomp: any;
  remarks: any;
  analysis: any;
  constructor(private EmapsService: EmapsService, 
    private readonly notificationService: NotificationService,
    public dialogRef: MatDialogRef<DialogStatusExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      //dialogRef.disableClose = true;
    }
    ind=0;
    img="";

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         //console.log('FileUpload:uploaded successfully:', item, status, response);
        // alert('Your file has been uploaded successfully');
    };
  }

  changeUrl() {
    var folder_name = this.data.id.prjct_id+"_"+this.date;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = this.uploadAPIOrg +'?'+ folder_name;
    }

    console.log("change Url to "+this.uploadAPIOrg +'?'+ folder_name);
  }
  save(){
    var folder_name = this.data.id.prjct_id+"_"+this.date;
    var d = [];
    d["date"] = this.date;
    d["balance"] = this.balance;
    d["accomp"] = this.accomp;
    d["remarks"] = this.remarks;
    d["analysis"] = this.analysis;
    // console.log(this.file);
    d["prjct_id"] = this.data.id.prjct_id;
    // console.log(folder_name);
    // this.uploadAPI = this.uploadAPIOrg+"?"+folder_name;
    //this.uploader= new FileUploader({ url: this.uploadAPI, itemAlias: 'file' });
    //this.ngOnInit();
    // console.log(this.uploadAPI);
    console.log(d);
    this.uploader.uploadAll();
    this.EmapsService.insertStatus(folder_name, this.date,this.balance,this.accomp,this.remarks,this.analysis,this.data.id.prjct_id).subscribe(data => {
      if(data==undefined || data==null){
        this.notificationService.info('Data null!');
      }
      else{
        //this.locs = data;
        //console.log(data);
      }
    });
    this.dialogRef.close();
    this.notificationService.success('Project status successfully added!');
  }

  onFileSelected() {
    var index=0;
    this.files=[];
    this.uploader.onAfterAddingFile = (fileItem) => {
      fileItem.withCredentials = false;
      //console.log(fileItem); // fileItem is the file object
      this.files[index]={name:fileItem.file.name};
      index++;
    };
  //   this.file = document.getElementById('file');
  //   console.log(this.file.files);
  //   const inputNode: any = document.querySelector('#file');

  //   if (typeof (FileReader) !== 'undefined' && this.file.files.length!=0) {
  //     const reader = new FileReader();
  
  //     reader.onload = (e: any) => {
  //       this.srcResult = e.target.result;
  //       console.log(e);
  //     };
  //     reader.readAsArrayBuffer(inputNode.files[0]);
  //   }
  }
}