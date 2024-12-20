import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  Inject,
  input,
  signal,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import type { Column } from '@tanstack/angular-table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { EIcon, ETableFilterType } from '@/enums';
import { TFunction } from '@/utils/angular';
import { CEMask } from '../form/entry/mask';
import { CSvgIcon } from '../svg-icon';
import { ETypeFilter } from './util';

@Component({
  selector: '[Filter]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CommonModule, NzDropDownModule, CSvgIcon, CEMask],
  template: `{{ handleAddClass(columnFilterValue) }}
    <svg
      nz-dropdown
      nzTrigger="click"
      [nzDropdownMenu]="dropdown"
      CSvgIcon
      [name]="columnFilterValue === undefined ? EIcon.Filter : EIcon.FilterFill"
      [size]="10"
    ></svg>
    <nz-dropdown-menu #dropdown="nzDropdownMenu">
      <div
        class="flex flex-col gap-1 rounded-lg bg-base-100 p-2 text-base-content"
        [ngClass]="{
          'w-56': column().columnDef.meta?.filter === ETableFilterType.Text,
          'w-52': column().columnDef.meta?.filter !== ETableFilterType.Text,
        }"
      >
        <p>{{ t.instant('ColumnName') }}</p>
        <div CEMask [disabled]="true" [placeholder]="" [value]="$any(column().columnDef.header) ?? ''"></div>
      </div>
    </nz-dropdown-menu>`,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class Filter implements OnInit {
  EIcon = EIcon;
  ETableFilterType = ETableFilterType;
  readonly column = input.required<Column<any>>();
  readonly refFilterTypeCurrent = input.required<any>();

  readonly state = signal<{ value?: any; isOpen?: boolean; error?: boolean }>({
    value: '',
    isOpen: false,
    error: false,
  });

  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<SVGElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {
    this.t.prefix = 'Components';
  }

  typeFilter = computed(() => ({
    text: [
      { value: ETypeFilter.IncludeText, label: this.t.instant('IncludeInputBelow') },
      { value: ETypeFilter.NotIncludeText, label: this.t.instant('DoNotIncludeInputBelow') },
      { value: ETypeFilter.StartText, label: this.t.instant('StartWithInputBelow') },
      { value: ETypeFilter.EndText, label: this.t.instant('EndWithInputBelow') },
      { value: ETypeFilter.SameText, label: this.t.instant('SameWithInputBelow') },
    ],
    date: [
      { value: ETypeFilter.SameDate, label: this.t.instant('DateMakeSame') },
      { value: ETypeFilter.BeforeDate, label: this.t.instant('DayBeforeInputBelow') },
      { value: ETypeFilter.AfterDate, label: this.t.instant('DayAfterInputBelow') },
    ],
    number: [
      { value: ETypeFilter.GreaterNumber, label: this.t.instant('GreaterThanInputBelow') },
      { value: ETypeFilter.GreaterEqualNumber, label: this.t.instant('GreaterThanOrEqualTo') },
      { value: ETypeFilter.LessNumber, label: this.t.instant('SmallerThanInputBelow') },
      { value: ETypeFilter.LessEqualNumber, label: this.t.instant('SmallerThanOrEqualTo') },
      { value: ETypeFilter.EqualNumber, label: this.t.instant('EqualToBelow') },
      { value: ETypeFilter.NotEqualNumber, label: this.t.instant('NotEqualToBelow') },
      { value: ETypeFilter.MiddleNumber, label: this.t.instant('InTheMiddleOfInputBelow') },
      { value: ETypeFilter.NotMiddleNumber, label: this.t.instant('NotInTheMiddleOfInputBelow') },
    ],
  }));
  columnFilterValue: unknown;
  refValue: unknown;
  refValueEnd: unknown;
  refValueDate: unknown;
  ngOnInit(): void {
    this.el.nativeElement.setAttribute('type', 'button');
    this.columnFilterValue = this.column().getFilterValue();
    this.refValue =
      typeof this.columnFilterValue !== 'object'
        ? (this.columnFilterValue?.toString() ?? '')
        : ((this.columnFilterValue as [number, number])?.[0]?.toString() ?? '');
    this.refValueEnd =
      typeof this.columnFilterValue !== 'object' ? (this.columnFilterValue as [number, number])?.[1]?.toString() : '';
    this.refValueDate = this.columnFilterValue;
    this.state.update(old => ({
      ...old,
      value: this.refFilterTypeCurrent()[this.column().id],
    }));
  }

  listClass = ['filter'];
  handleAddClass = columnFilterValue => {
    this.el.nativeElement.setAttribute(
      'class',
      [...this.listClass, columnFilterValue === undefined ? 'opacity-0' : ''].join(' '),
    );
  };

  handleReset = () => {
    delete this.refFilterTypeCurrent()[this.column().id];
    this.column().columnDef.filterFn = undefined;
    this.column().setFilterValue(undefined);
    this.state.update(old => ({
      ...old,
      error: false,
      isOpen: false,
      value: this.refFilterTypeCurrent().value[this.column().id],
    }));
  };

  handleSubmit = () => {
    let value = this.refValue ?? null;
    let isOpen = true;
    if (this.state().value) {
      this.refFilterTypeCurrent[this.column().id] = this.state().value;
      if (this.state().value === ETypeFilter.MiddleNumber || this.state().value === ETypeFilter.NotMiddleNumber) {
        value = this.refValue && this.refValueEnd ? [this.refValue, this.refValueEnd] : null;
      } else if (this.column().columnDef.meta?.filter === ETableFilterType.Date) value = this.refValueDate ?? null;
      if (this.state().value === ETypeFilter.Blank || this.state().value === ETypeFilter.NotBlank) {
        this.column().columnDef.filterFn = this.state().value;
        this.column().setFilterValue(null);
        isOpen = false;
      } else if (value) {
        // TODO
        this.column().columnDef.filterFn = this.state().value;
        this.column().setFilterValue(value);
        isOpen = false;
      }
    }
    this.state.update(old => ({
      ...old,
      error: isOpen,
      isOpen: isOpen,
      value: this.refFilterTypeCurrent().value[this.column().id],
    }));
  };

  // set value when input field change.
  handleOnChangeValue = e => {
    if ((e.target.value && this.state().error) || (!e.target.value && !this.state().error)) {
      this.state.update(old => ({
        ...old,
        error: !old.error,
      }));
    }
    this.refValue = e.target.value;
  };

  // set value when range number field change.
  handleOnChangeValueEnd = e => {
    this.refValueEnd = e.target.value;
    if ((e.target.value && this.state().error) || (!e.target.value && !this.state().error)) {
      this.state.update(old => ({
        ...old,
        error: !old.error,
      }));
    }
  };

  // set value when date pick field change.
  handleOnChangeValueDate = e => {
    this.refValueDate = e;
    if ((e && this.state().error) || (!e && !this.state().error)) {
      this.state.update(old => ({
        ...old,
        error: !old.error,
      }));
    }
  };
}
