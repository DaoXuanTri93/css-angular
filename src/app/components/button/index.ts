import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, input, ViewEncapsulation } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import type { EButtonSize, EIcon } from '@/enums';
import { CSvgIcon } from '../svg-icon';

@Component({
  selector: '[CButton]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzSpinModule, CSvgIcon],
  template: `
    <ng-container>
      <nz-spin *ngIf="isLoading()" nzSimple nzSize="small" />
      <svg *ngIf="!isLoading() && !!icon()" CSvgIcon [name]="icon()" [size]="!size() ? 20 : 12"></svg>
      {{ text() }}
    </ng-container>
  `,
  styleUrl: './index.less',
})
export class CButton implements OnInit {
  readonly text = input<string>();
  readonly size = input<EButtonSize>();
  readonly icon = input<EIcon>();
  readonly title = input<string>();
  readonly type = input<string>();
  readonly className = input<string>('');
  readonly isOutline = input<boolean>(false);
  readonly isLoading = input<boolean>(false);

  constructor(@Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>) {}

  ngOnInit(): void {
    this.el.nativeElement.title = this.title() ? (this.title() ?? '') : (this.text() ?? '');
    const listClass = ['btn', this.size(), this.className()];
    if (this.isOutline()) listClass.push('out-line');
    this.el.nativeElement.setAttribute('class', listClass.join(' '));
    if (!this.type()) this.el.nativeElement.setAttribute('type', 'button');
  }
}
