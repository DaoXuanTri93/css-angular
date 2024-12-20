import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: '[CEPassword]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, CSvgIcon],
  template: `
    <input
      autoComplete="on"
      [type]="state().toggle ? 'password' : 'text'"
      class="ant-input pr-9"
      [disabled]="disabled()"
      [value]="value()"
      [placeholder]="placeholder()"
      (blur)="onBlur.emit($event)"
      (input)="onChange.emit($event)"
    />
    <button type="button" class="icon" (click)="click()">
      <svg CSvgIcon [name]="state().toggle ? EIcon.EyeSlash : EIcon.Eye" class="icon"></svg>
    </button>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CEPassword {
  EIcon = EIcon;
  readonly value = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>();

  readonly onBlur = output<FocusEvent>();
  readonly onChange = output<Event>();

  readonly state = signal({
    toggle: true,
  });
  readonly click = () => {
    this.state.update(old => ({ ...old, toggle: !old.toggle }));
  };

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {
    this.el.nativeElement.setAttribute('class', 'relative');
  }
}
