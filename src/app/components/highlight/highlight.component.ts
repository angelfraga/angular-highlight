import { Component, Input, ViewEncapsulation } from '@angular/core';

export type HighlightDecorationClass = 'underline' | 'line-through' | 'none' | 'overline';

@Component({
  selector: 'highlight',
  templateUrl: 'highlight.component.html',
  styleUrls: ['highlight.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HighlightComponent {
  @Input() value;
  @Input() query;
  @Input() decoration = 'underline';
}