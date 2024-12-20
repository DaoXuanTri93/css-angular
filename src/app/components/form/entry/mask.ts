import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  output,
  ViewChild,
  ViewEncapsulation,
  type TemplateRef,
} from '@angular/core';

@Component({
  selector: '[CEMask]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    <span *ngIf="addonBefore()" class="before">
      <ng-container [ngTemplateOutlet]="addonBefore() ?? null"></ng-container>
    </span>
    <input
      #entry
      [type]="type()"
      class="ant-input"
      [ngClass]="{ before: !!addonBefore(), after: !!addonAfter(), disabled: disabled() }"
      [disabled]="disabled()"
      [value]="value()"
      [placeholder]="placeholder()"
      (blur)="onBlur.emit($event)"
      (input)="onChange.emit($event)"
      (focus)="onFocus.emit($event)"
      (keyup.enter)="onPressEnter.emit($event)"
    />
    <span *ngIf="addonAfter()" class="after">
      <ng-container [ngTemplateOutlet]="addonAfter() ?? null"></ng-container>
    </span>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CEMask {
  readonly mask = input<any>();
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>();
  readonly type = input<string>();
  readonly addonBefore = input<TemplateRef<unknown>>();
  readonly addonAfter = input<TemplateRef<unknown>>();

  readonly onBlur = output<FocusEvent>();
  readonly onChange = output<Event>();
  readonly onFocus = output<Event>();
  readonly onPressEnter = output<Event>();

  @ViewChild('entry') entry?: any;

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {
    !!this.mask() &&
      !!this.entry &&
      IMask(this.entry.nativeElement, { mask: this.mask(), normalizeZeros: true, radix: '.' });
    this.el.nativeElement.setAttribute('class', 'relative');
  }
}
