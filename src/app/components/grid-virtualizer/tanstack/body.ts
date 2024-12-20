import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  input,
  ViewEncapsulation,
  type OnInit,
} from '@angular/core';
import type { Column } from '@tanstack/angular-table';
import type { VirtualItem } from '@tanstack/angular-virtual';

@Component({
  selector: '[Body]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: ` <tbody [ngStyle]="{ height: isVirtualized() ? rowVirtualizer().getTotalSize() + 2 + 'px' : 'auto' }">
    @for (
      virtualRow of generateArray(isVirtualized() ? rowVirtualizer().getVirtualItems() : table().getRowModel().rows);
      track table().getRowModel().rows[virtualRow.index].id
    ) {
      <tr></tr>
    }
  </tbody>`,
})
export class Body implements OnInit {
  readonly table = input.required<any>();
  readonly isVirtualized = input<boolean>();
  readonly rowVirtualizer = input.required<any>();
  readonly columnVirtualizer = input.required<any>();
  readonly currentId = input<string>();
  readonly rowSelection = input<{
    onChange?: (selectedRows: any[]) => void;
    columnWidth?: number;
  }>();
  readonly keyId = input<string>('id');
  readonly refVirtualPaddingLeft = input.required<number>();
  readonly virtualColumns = input.required<VirtualItem[]>();
  readonly getCommonPinningStyles = input<(column: Column<any>) => string>();
  readonly heightCell = input<number>(28);

  constructor(@Inject(ElementRef) private readonly el: ElementRef<SVGElement>) {}

  ngOnInit(): void {}
  generateArray = array => {
    return array;
  };
}
