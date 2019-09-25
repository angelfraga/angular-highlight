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
      <option value="custom">custom</option>
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
  value = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus in ornare lacus. Morbi tincidunt nunc facilisis elit porta scelerisque. Duis aliquet pretium lacus eu tristique. Nullam id congue purus. Ut facilisis malesuada nunc, sit amet venenatis lacus dignissim non. Fusce vel condimentum lacus. Donec tempus, quam eget porta lobortis, felis lacus hendrerit velit, ut imperdiet libero ante ac dolor. Nullam at ante vitae est feugiat pulvinar et nec ipsum.

Etiam dignissim, justo id tincidunt volutpat, sem tortor tincidunt mauris, et pellentesque quam quam et dui. Integer risus nunc, porta vel ex vel, iaculis ornare ligula. Etiam in nisl egestas, facilisis nunc eu, tempor lorem. Nunc viverra varius erat. Integer commodo malesuada lorem, ac posuere eros tincidunt ac. Nulla magna ipsum, viverra a imperdiet vel, faucibus ac risus. Integer mi ipsum, suscipit eu cursus eget, egestas semper dolor. Nulla posuere dignissim turpis non dapibus. Nam tempor auctor volutpat. Cras quis consequat urna. Nunc non lacus in velit pretium eleifend non sit amet nulla. Nam at congue massa. Integer nec varius est, non vestibulum mi. Ut eget laoreet lacus. Ut lectus diam, tempor vel ex a, cursus mattis metus.

Proin lorem purus, condimentum euismod dictum ut, ultrices non nisi. Nulla tincidunt risus non lacinia semper. Praesent mollis lacinia tempor. Sed vitae rutrum nibh. Ut sed mattis arcu. Aliquam ornare porttitor sem vitae sagittis. Proin auctor mattis semper. Duis faucibus justo eget mi scelerisque mattis. Sed nisl augue, interdum at augue ac, finibus ultrices mauris.

Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc vel hendrerit sapien. Cras posuere vulputate sem, eget posuere erat placerat sed. Maecenas in porta tellus. Suspendisse id ante vitae ex laoreet semper vel non nibh. Integer placerat diam ac nisl feugiat, quis laoreet lectus porta. Fusce sed pharetra quam, sit amet vehicula tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque ultricies nec velit nec dictum. Donec convallis rhoncus sapien non vehicula. Fusce facilisis blandit mi ut laoreet. Vivamus eu erat non risus auctor lobortis non aliquam lorem. Pellentesque vitae commodo tellus. Sed suscipit hendrerit velit, vitae vehicula risus maximus et. Praesent porttitor diam quis nibh fringilla placerat. Nunc tincidunt ac turpis et ullamcorper.

Nam bibendum ligula ipsum, a dapibus risus egestas in. Pellentesque et enim vitae eros porta viverra. Maecenas vitae nisi varius, maximus ex vel, tempor leo. Mauris feugiat, neque ac elementum rutrum, libero orci iaculis nisl, at commodo lectus justo a massa. Nullam consequat enim in nibh cursus porttitor. Curabitur ut est pretium, aliquam ante at, consectetur dolor. Proin dignissim leo id turpis interdum, at tempus orci interdum. Aenean erat orci, maximus non tellus ac, varius iaculis leo. Mauris non ante ac dolor viverra congue id eu nibh.`;
  term = 'dolor';
  decoration = 'custom';
}
