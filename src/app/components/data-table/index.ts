import { ETablePinAlign } from '@/enums';
import type { IDataTable, IPaginationQuery } from '@/interfaces';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  Inject,
  input,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import type { ColumnDef, ColumnPinningState, FilterFn, Table } from '@tanstack/angular-table';
import type { Virtualizer } from '@tanstack/angular-virtual';
import { CGridVirtualizer } from '../grid-virtualizer';

@Component({
  selector: '[CDataTable]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CGridVirtualizer],
  template: `<div
    class="data-table"
    *ngIf="data() && state()?.columns"
    CGridVirtualizer
    [heightCell]="heightCell()"
    [columnPinning]="state().columnPinning"
    [data]="data()"
    [paginationDescription]="paginationDescription()"
    [columns]="state().columns || []"
    [isPagination]="isPagination()"
    [filterGlobal]="filterGlobal()"
    [style]="style"
    [onScroll]="onScroll"
    [isExpanded]="isExpanded()"
    (onExpand)="onExpand.emit($event)"
    [rowSelection]="rowSelection()"
    [isVirtualized]="isVirtualized()"
    [keyId]="keyId()"
    [currentId]="currentId()"
  ></div>`,
})
// [onRow]="onRow()"
export class CDataTable {
  readonly columns = input.required<IDataTable[]>();
  readonly defaultParams = input<IPaginationQuery[]>();
  readonly rightHeader = input<TemplateRef<unknown>>();
  readonly leftHeader = input<TemplateRef<unknown>>();
  readonly paginationDescription = input(
    (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  );
  readonly data = input.required<any[]>();
  readonly isPagination = input<boolean>();
  readonly isSearch = input<boolean>();
  readonly onRow = input<{
    onDoubleClick?: () => void;
    onClick?: () => void;
  }>();
  readonly isLoading = input<boolean>();
  readonly action = input<{
    onDisable?: any;
    onEdit?: any;
    onDelete?: any;
    label: any;
    name: any;
    onAdd?: any;
    labelAdd?: any;
    render?: any;
    width?: number;
    fixed?: ETablePinAlign;
  }>();
  readonly filterGlobal = input<FilterFn<any>>();
  readonly style = input<CSSStyleValue>();
  readonly onScroll =
    input<
      (props: {
        event: any;
        table: Table<any>;
        columnVirtualizer: Virtualizer<HTMLDivElement, Element>;
        rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
      }) => void
    >();
  readonly isExpanded = input<boolean>();
  readonly onExpand = output<any>();
  readonly heightCell = input<number>(28);
  readonly rowSelection = input<{
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  }>();
  readonly isVirtualized = input<boolean>();
  readonly keyId = input<string>('id');
  readonly currentId = input<string>();
  readonly columnPinning = input<ColumnPinningState>();

  readonly state = signal<{ columns?: ColumnDef<any>[]; columnPinning?: ColumnPinningState }>({});

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {
    effect(
      () => {
        const columnPinning: ColumnPinningState = {};
        const orginColumns = this.columns();

        orginColumns.forEach(item => {
          if (item.tableItem?.fixed && item.name) {
            if (item.tableItem.fixed === ETablePinAlign.Left) {
              if (!columnPinning.left) columnPinning.left = [];
              columnPinning.left?.push(item.name);
            } else if (item.tableItem.fixed === ETablePinAlign.Right) {
              if (!columnPinning.right) columnPinning.right = [];
              columnPinning.right?.push(item.name);
            }
          }
          // if (item?.tableItem?.isDateTime && !item.tableItem?.render) {
          //   const day = text => dayjs(text).format(FORMAT_DATE + ' HH:mm:ss');
          //   item.tableItem.render = text => <CTooltip title={day(text)}>{dayjs(text).format(FORMAT_DATE)}</CTooltip>;
          // }
          this.state.update(old => ({
            ...old,
            columns: orginColumns.map(item => ({
              accessorKey: item.name,
              header: item.title,
              size: item.tableItem?.width,
              meta: {
                sorter: item.tableItem?.sorter,
                onCell: item.tableItem?.onCell,
                align: item.tableItem?.align,
                filter: item.tableItem?.filter,
              },
              cell:
                item?.tableItem?.render && item.name
                  ? ({ row }) => item.tableItem!.render!(row.original[item.name ?? ''], row.original)
                  : undefined,
            })),
            columnPinning: Object.keys(columnPinning).length > 0 ? columnPinning : undefined,
          }));
        });
      },
      { allowSignalWrites: true },
    );
  }
}
