import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import {EmapsService} from './services/emaps.service';
import { AgGridModule } from 'ag-grid-angular';
import { MatCarouselModule } from '@ngmodule/material-carousel';


@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app,
    AppRoutingModule,
    MatCarouselModule.forRoot(),
    AgGridModule.withComponents([])
  ],
  declarations: [AppComponent],
  providers: [EmapsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
