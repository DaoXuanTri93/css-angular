import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, input, ViewEncapsulation } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { EFormType, EIcon } from '@/enums';
import type { IFormItem } from '@/interfaces';
import { FormsModule } from '@angular/forms';
import { CEAddable } from '.';
import { CSvgIcon } from '../../../svg-icon';
import { CEMask } from '../mask';
import { CEPassword } from '../password';
import { CESelect } from '../select';

@Component({
  selector: '[Info2]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    NzSpinModule,
    CSvgIcon,
    CEMask,
    CEPassword,
    CESelect,
    NzCheckboxModule,
    CEAddable,
  ],
  templateUrl: './info.html',
})
export class Info2 {
  EIcon = EIcon;
  EFormType = EFormType;

  readonly form = input.required<any>();
  readonly t = input.required<any>();
  readonly translatePage = input.required<any>();
  readonly field = input.required<any>({});
  readonly formItem = input<IFormItem>();
  readonly meta = input<any>();
  readonly title = input<string>();
  readonly name = input<string>();
  readonly value = input<any>();
  readonly isChild = input<boolean>(false);

  constructor(@Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>) {
    const listClass = [''];
    this.el.nativeElement.setAttribute('class', listClass.join(' '));
  }

  isError = (field: any) =>
    (field.api.state.meta.isTouched && field.api.state.meta.errors.length > 0) || field.api.state.meta.isValidating;
}
