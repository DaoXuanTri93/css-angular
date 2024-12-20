import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation, type OnInit } from '@angular/core';
import type { Column, ColumnPinningState, HeaderGroup } from '@tanstack/angular-table';
import type { VirtualItem } from '@tanstack/angular-virtual';

import { CSvgIcon } from '@/components/svg-icon';
import { EIcon } from '@/enums';
import { Filter } from './filter';

@Component({
  selector: '[Header]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CSvgIcon, Filter],
  template: ` @for (headerGroup of table().getHeaderGroups(); let index = $index; track headerGroup.id) {
    <tr>
      <th
        *ngIf="isVirtualized() && index === table().getHeaderGroups().length - 1 && refVirtualPaddingLeft()"
        [style.width.px]="refVirtualPaddingLeft()"
      ></th>
      @for (
        header of generateArray(
          isVirtualized() && index === table().getHeaderGroups().length - 1 ? virtualColumns : headerGroup.headers
        );
        track header.id
      ) {
        <!-- [ngStyle]="getCommonPinningStyles()(header?.column, header?.id)" -->

        <th
          [ngClass]="{
            'has-sorter': header?.column?.getCanSort(),
            'has-filter': header?.column?.getCanFilter(),
          }"
          [ariaLabel]="header?.column?.columnDef.header?.toString()"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between"
            [ngClass]="{
              'cursor-default': !header?.column?.columnDef?.meta?.sorter || !header?.column?.getCanSort(),
              hidden: header?.column?.columnDef?.meta?.isHeaderHide,
              '!text-center': header?.id === 'rowSelection',
            }"
            (click)="header?.column?.columnDef?.meta?.sorter && header?.column?.getToggleSortingHandler()"
          >
            <ng-container *flexRender="header.column.columnDef.header; props: header.getContext(); let headerText">
              {{ headerText }}
            </ng-container>
            <svg
              *ngIf="header?.column?.getIsSorted()"
              CSvgIcon
              [name]="EIcon.Sort"
              [size]="10"
              class="sort"
              [ngClass]="{ 'rotate-180': header?.column?.getIsSorted() === 'asc' }"
            ></svg>
          </button>
          <div Filter [column]="header.column" [refFilterTypeCurrent]="refFilterTypeCurrent"></div>
          <button
            type="button"
            class="resizer"
            [ngClass]="{ resizing: header?.column?.getIsResizing() }"
            (dblclick)="header?.column?.resetSize()"
            (mousedown)="header?.getResizeHandler($event)()"
            (touchstart)="header?.getResizeHandler($event)()"
          ></button>
        </th>
      }
    </tr>
  }`,
})
export class Header implements OnInit {
  EIcon = EIcon;
  readonly table = input.required<any>();
  readonly isVirtualized = input<boolean>();
  readonly refVirtualPaddingLeft = input.required<number>();
  readonly virtualColumns = input.required<VirtualItem[]>();
  readonly refHeaderGroups = input.required<HeaderGroup<any>[]>();
  readonly state = input.required<any>();
  readonly columnVirtualizer = input.required<any>();
  readonly columnPinning = input<ColumnPinningState>();
  readonly isRightClickHeader = input<boolean>();
  readonly getCommonPinningStyles = input<(column: Column<any>, id: string) => string>();
  readonly isResizing = input<boolean>();

  refFilterTypeCurrent;

  ngOnInit(): void {}

  generateArray = array => {
    return array;
  };
}
