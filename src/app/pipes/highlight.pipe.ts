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