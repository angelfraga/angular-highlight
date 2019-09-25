import { Component,OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';
import { escape, escapeRegExp } from 'lodash/fp';

export interface HighlightConfig {
  query: string;
  cssClass?: string;
}

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {

  public static readonly cssClass = 'highlightText';

  public static applyHighlight(value: string, config: HighlightConfig ) {
    if(!config) {
      throw new Error('HighlightConfig is missing');
    }
  
    const {query, cssClass = this.cssClass } = config;

    if (!config.query || !value) {
      return escape(value);
    }
  
    const span = document.createElement('span');
    span.classList.add(cssClass);
    const sanitizedQuery = escapeRegExp(escape(query));
    const result = escape(value).replace(new RegExp(sanitizedQuery, 'g'), (match, i, e) => {
      span.innerHTML = match;
      return span.outerHTML;
    });
  
    return result;
  }
  /**
   * Note: use with innerHTML directives
   * e.g
   * <div [innerHTML]="'hello world' | highlight: {query: 'll'} "></div>
   */
  constructor() { }
  transform(value: string, config: HighlightConfig): string {
    return HighlightPipe.applyHighlight(value, config );
  }
}

export type HighlightDecorationClass = 'underline' | 'line-through' | 'none' | 'overline';


@Component({
  selector: 'highlight',
  template: `
   <div [ngClass]="decoration" [innerHTML]="value | highlight: { query: query }" ></div>
  `,
  styles: [
    `::ng-deep .underline  .highlightText {
      text-decoration: underline
    }
    ::ng-deep .line-through .highlightText {
      text-decoration: line-through
    }
     ::ng-deep .overline .highlightText {
      text-decoration: overline
    }
    ::ng-deep .none .highlightText {
      text-decoration: none
    }
    `
  ]
})
export class HighlightComponent {
  @Input() value;
  @Input() query;
  @Input() decoration = 'underline';
}

@Component({
  selector: 'my-app',
  template: `
    <label> Decoration : </label> <br>
    <select [(ngModel)]="decoration">
      <option value="underline">underline</option>
      <option value="line-through">line-through</option>
      <option value="overline">overline</option>
      <option value="none">none</option>
    </select>
    <br>
    <label> Term : </label> <br>
    <input type="text" [(ngModel)]="term" /><br>
    <label> Value : </label> <br>
    <textarea [(ngModel)]="value" ></textarea>
    <hr>
    <highlight [value]="value" [decoration]="decoration" [query]="term"></highlight>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  value = 'Hello world';
  term = 'll';
  decoration = 'underline';
}
