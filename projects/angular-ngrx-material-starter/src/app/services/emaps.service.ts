import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export class List {
  accr_num: string;
  address: string;
  chairperson: string;
  members: number;
  date: string;
  name: string;
  signatory: string;
  mine: number;
}


@Injectable({
  providedIn: 'root'
})
export class EmapsService {
  constructor(private http: HttpClient) {}

  // apiRoot = 'http://210.5.100.46:7223';
  // apiRoot = 'http://172.16.130.10:7223';
  apiRoot = 'http://localhost:6277';

  getProjects() {
    const url = `${this.apiRoot}/project`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'))
    return this.http.post(url, {token});
  }
  getYear() {
    const url = `${this.apiRoot}/getYear`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'))
    return this.http.post(url, {token});
  }
  getCategory() {
    const url = `${this.apiRoot}/getCategory`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'))
    return this.http.post(url, {token});
  }
  getLocs() {
    const url = `${this.apiRoot}/getLocs`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'))
    return this.http.post(url, {token});
  }
  getIc() {
    const url = `${this.apiRoot}/getIc`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'))
    return this.http.post(url, {token});
  }
  getStatus(id) {
    const url = `${this.apiRoot}/getStatus`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'));
    return this.http.post(url, {token,id});
  }
  getSubCat() {
    const url = `${this.apiRoot}/getSubCat`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'));
    return this.http.post(url, {token});
  }
  insertProject(val) {
    const url = `${this.apiRoot}/insertProject`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'));
    return this.http.post(url, {token,val});
  }
  
  insertStatus(val,date,balance,accomp,remarks,analysis,prjct_id) {
    const url = `${this.apiRoot}/insertStatus`;
    var token = JSON.parse(localStorage.getItem('ANMS-AUTH'));
    return this.http.post(url, {token,val,date,balance,accomp,remarks,analysis,prjct_id});
  }
}
