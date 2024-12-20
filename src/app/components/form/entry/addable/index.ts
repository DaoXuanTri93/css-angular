import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { CButton } from '@/components/button';
import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import type { IForm } from '@/interfaces';
import { convertFormValue } from '../../convert';
import { handleCondition } from '../../util';
import { Field2 } from './field';

@Component({
  selector: '[CEAddable]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CSvgIcon, CommonModule, Field2, CButton],
  template: `
    @for (item of value(); track $index; let i = $index) {
      <div class="grid grid-cols-12 gap-x-5">
        @for (col of getColumn($index); track col.name; let index = $index) {
          <div [class]="['item col-span-12', 'sm:col-span-' + (col?.formItem?.col ?? 12)]">
            <ng-container
              *ngTemplateOutlet="
                entry;
                context: {
                  col: col,
                  index: index,
                  i: i,
                  form: form(),
                  t: t(),
                  translatePage: translatePage(),
                  value: value(),
                }
              "
            >
            </ng-container>
          </div>
        }
        <div class="table-cell w-8 align-middle">
          <button
            type="button"
            *ngIf="showRemove()(item)"
            (click)="field()?.api.removeValue(i); onAdd.emit(form().getFieldValue(name()))"
          >
            <svg CSvgIcon [name]="EIcon.Trash" [size]="20" class="fill-error hover:fill-error/50"></svg>
          </button>
        </div>
      </div>
    }
    <div class="flex justify-end">
      <button CButton [icon]="EIcon.Plus" [text]="textAdd()" (click)="handleAddItem()"></button>
    </div>
    <ng-template
      #entry
      let-col="col"
      let-index="index"
      let-i="i"
      let-form="form"
      let-t="t"
      let-translatePage="translatePage"
      let-value="value"
    >
      <div
        Field2
        [item]="col"
        [index]="index"
        [isLabel]="false"
        [name]="getName(i, col.name)"
        [t]="t"
        [form]="form"
        [values]="value[i]"
        [translatePage]="translatePage"
        [isChild]="true"
      ></div>
    </ng-template>
  `,
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CEAddable {
  EIcon = EIcon;
  readonly value = input<any>([]);
  readonly form = input.required<any>();
  readonly name = input<string>();
  readonly column = input<IForm[]>();
  readonly textAdd = input<string>();
  readonly translatePage = input<any>();
  readonly t = input<any>();
  readonly showRemove = input<any>();
  readonly field = input.required<any>();

  readonly onAdd = output<any>();

  readonly isTable = input<boolean>();
  readonly idCheck = input<any>();
  getName = (idx: number, name: string) => `${this.name()}[${idx}].${name}` as const;
  getColumn = (i: number) =>
    this.column()?.filter((item, index) => handleCondition({ item, index, values: this.value[i] }));
  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  handleAddItem = () => {
    this.field()?.api.pushValue(convertFormValue(this.column() ?? [], {}, false));
    this.onAdd.emit(this.form().getFieldValue(this.name()));
    setTimeout(() => {
      console.log(this.value());
    }, 1000);
  };
}
