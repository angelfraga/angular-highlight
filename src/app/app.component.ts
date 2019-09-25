import { Component,OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'Highlight' })
export class HighlightPipe implements PipeTransform {

  public static readonly cssClass = 'highlightText';

  /**
   * https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
   * @param text string to be escaped
   */
  public static escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public static applyHighlight(value: string, query: string, cssClass: string = this.cssClass) {
    if (!query || !value) {
      return value;
    }
    const span = document.createElement('span');
    span.classList.add(cssClass);
    const div = document.createElement('div');
    div.textContent = value;
    const sanitizedValue = div.innerHTML;
    div.textContent = query;
    const sanitizedQuery = this.escapeRegExp(div.innerHTML);
    const result = sanitizedValue.replace(new RegExp(sanitizedQuery, 'gi'), (match, i, e) => {
      span.textContent = match;
      return span.outerHTML;
    });
    return result;
  }
  /**
   * Note: use with outerHTML or innerHTML directives
   * e.g
   * <div [outerHTML]="'hello world' | gsecHighlight: 'll'"></div>
   * <div [innerHTML]="'hello world' | gsecHighlight: 'll'"></div>
   */
  constructor() { }
  transform(value: string, query: string): string {
    return HighlightPipe.applyHighlight(value, query);
  }
}

export type HighlightDecorationClass = 'underline' | 'line-through' | 'none' | 'overline';


@Component({
  selector: 'highlight',
  template: `
   <div [ngClass]="decoration" [innerHTML]="result$ | async" ></div>
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
export class HighlightComponent implements OnDestroy {

  value$ = new BehaviorSubject<string>('');
  term$ = new BehaviorSubject<string>('');
  componentDestroyed$ = new Subject();
  result$ = new BehaviorSubject<string>('');

  @Input() set value(value: string) {
    this.value$.next(value);
  }

  @Input() set term(term: string) {
    this.term$.next(term);
  }

@Input() decoration: (HighlightDecorationClass | string)[] = ['underline'];

  constructor() {
    combineLatest([
      this.value$,
      this.term$
    ]).pipe(
      takeUntil(this.componentDestroyed$),
      map(([value, term]) => {
        return HighlightPipe.applyHighlight(value, term);
      })
    ).subscribe(this.result$);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
  }

}


@Component({
  selector: 'my-app',
  template: `
    <highlight value="ok" decoration="overline" term="k"></highlight>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular';
}
