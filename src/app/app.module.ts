import { NgModule } from '@angular/core';
import  { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import * as pipes from './pipes';
import * as components from './components';
import { HelloComponent } from './hello.component';

@NgModule({
  imports:      [ CommonModule, BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent,  components.HighlightComponent, pipes.HighlightPipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
