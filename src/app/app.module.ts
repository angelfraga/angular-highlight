import { NgModule } from '@angular/core';
import  { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent, HighlightComponent, HighlightPipe } from './app.component';
import { HelloComponent } from './hello.component';

@NgModule({
  imports:      [ CommonModule, BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent,  HighlightComponent, HighlightPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
