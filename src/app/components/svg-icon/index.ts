import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';

import type { EIcon } from '@/enums';

@Component({
  selector: '[CSvgIcon]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `<svg:use [attr.href]="'/assets/images/sprite.svg#icon_' + name()" />`,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CSvgIcon implements OnInit {
  readonly name = input<EIcon>();
  readonly size = input<number>();
  readonly className = input<string>();
  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  ngOnInit(): void {
    const className = this.className();
    if (className) this.el.nativeElement.setAttribute('class', className);
    if (this.size) {
      this.el.nativeElement.style.width = `${this.size()}px`;
      this.el.nativeElement.style.height = `${this.size()}px`;
    }
  }
}
