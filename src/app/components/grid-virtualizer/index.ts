import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  output,
  viewChild,
  ViewEncapsulation,
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  type TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import type { CellContext, ColumnDef, ColumnPinningState, FilterFn, Table } from '@tanstack/angular-table';
import type { Virtualizer } from '@tanstack/angular-virtual';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { EIcon, ETableFilterType } from '@/enums';
import { formatDateTime } from '@/utils';
import { TFunction } from '@/utils/angular';
import { Tanstack } from './tanstack';

@Component({
  selector: '[CGridVirtualizer]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule, NzCheckboxModule, Tanstack],
  template: `
    <div
      Tanstack
      [data]="data()"
      [widthCell]="widthCell()"
      [heightCell]="heightCell()"
      [maxSize]="maxSize()"
      [columns]="columns()"
      [rowSelection]="rowSelection()"
      [columnPinning]="columnPinning()"
      [isResizing]="isResizing()"
      [isExpanded]="isExpanded()"
      [pageSize]="pageSize()"
      [isPagination]="isPagination()"
      [isFilter]="isFilter()"
      [paginationDescription]="paginationDescription()"
      [filterGlobal]="filterGlobal()"
      [style]="style"
      [onScroll]="onScroll"
      (onExpand)="onExpand.emit($event)"
      [isVirtualized]="isVirtualized()"
      [keyId]="keyId()"
      [currentId]="currentId()"
    ></div>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
/**
 * @param name - The name of the icon.
 * @param size - The size of the icon (optional).
 * @param className - The CSS class name for the icon (optional).
 */
export class CGridVirtualizer implements OnInit, OnChanges {
  EIcon = EIcon;

  readonly data = input.required<any[]>();
  readonly columns = input.required<ColumnDef<any>[]>();
  readonly columnPinning = input<ColumnPinningState>();
  readonly filterGlobal = input<FilterFn<any>>();
  readonly style = input<CSSStyleValue>();
  readonly paginationDescription = input(
    (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  );
  readonly firstItem = input<any>();

  readonly widthCell = input<number>(28);
  readonly heightCell = input<number>(28);
  readonly pageSize = input<number>();
  readonly maxSize = input<number>(1200);

  readonly isExpanded = input<boolean>();
  readonly isResizing = input<boolean>();
  readonly isPagination = input<boolean>();
  readonly isVirtualized = input<boolean>();
  readonly isRightClickHeader = input<boolean>();
  readonly isFilter = input<boolean>();

  readonly className = input<string>();
  readonly keyId = input<string>('id');
  readonly currentId = input<string>();
  readonly rowSelection = input<{
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  }>();
  readonly onScroll =
    input<
      (props: {
        event: any;
        table: Table<any>;
        columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
        rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
      }) => void
    >();

  readonly onExpand = output<any>();
  readonly onRow = output<any>();
  readonly onChange = output<any>();

  state: { columns?: ColumnDef<any>[] } = {};
  constructor(
    @Inject(ElementRef) private readonly parentRef: ElementRef<HTMLDivElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {
    this.t.prefix = 'Components';
  }
  readonly renderExpandedColumn = viewChild.required<TemplateRef<unknown>>('renderExpandedColumn');
  readonly rowSelectionHeader = viewChild.required<TemplateRef<unknown>>('rowSelectionHeader');
  readonly rowSelectionCell = viewChild.required<TemplateRef<unknown>>('rowSelectionCell');
  renderCellDate = ({ getValue }: CellContext<any, any>) => formatDateTime(getValue());

  ngOnInit(): void {
    this.initColumns();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && changes['columns'].currentValue !== changes['columns'].previousValue) {
      this.initColumns();
    }
  }

  initColumns = () => {
    setTimeout(() => {
      if (this.parentRef.nativeElement) {
        const originColumns = this.columns().map(column => {
          if (column.meta?.filter === ETableFilterType.Date && !column.cell) {
            column.cell = this.renderCellDate;
          }
          return column;
        });
        if (this.isExpanded() && this.columns.length > 0) {
          originColumns[0].cell = this.renderExpandedColumn;
          if (!originColumns[0].meta) originColumns[0].meta = {};
          originColumns[0].meta.cellStyle = ({ row }: CellContext<any, any>) => ({
            paddingLeft: `${row.depth * 1.5}rem`,
          });
        }
        if (this.rowSelection() && !originColumns.find(col => col.id === 'rowSelection')) {
          originColumns.unshift({
            id: 'rowSelection',
            size: this.rowSelection()?.columnWidth ?? 30,
            header: this.rowSelectionHeader,
            cell: this.rowSelectionCell,
            meta: { isHeaderHide: true },
          });
        }
        const arrayWidthColumn = originColumns.map(column => column.size ?? 0);
        const totalWidthColumns = arrayWidthColumn.reduce((prve, next) => prve + next, 0);
        const widthCell =
          (this.parentRef.nativeElement.getBoundingClientRect().width - totalWidthColumns) /
          arrayWidthColumn.filter(size => !size).length;
        const newColumns = this.columns().map(column => ({ ...column, size: column.size ?? widthCell }));
        newColumns[newColumns.length - 1].size = newColumns[newColumns.length - 1].size - 1;
        if (JSON.stringify(this.state.columns) !== JSON.stringify(newColumns)) this.state.columns = newColumns;
      }
    }, 140);
  };
}
