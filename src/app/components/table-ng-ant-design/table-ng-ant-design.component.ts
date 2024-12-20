import { EIcon } from '@/enums';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, type OnInit, type SimpleChanges } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CSvgIcon } from '../svg-icon';
export interface TableColumn {
  title?: string;
  key?: string; // Key to map data
  rowspan?: number;
  colspan?: number;
  children?: TableColumn[]; // For nested headers
  clickable?: boolean;
  icon?: EIcon;
  fixLeft?: boolean;
  leftPosition?: string;
  show?: boolean;
  width?: string;
}

@Component({
  selector: '[app-reusable-table]',
  standalone: true,
  imports: [NzTableModule, NgFor, NgIf, NgClass, NzIconModule, CSvgIcon, NzToolTipModule],
  templateUrl: './table-ng-ant-design.component.html',
  styleUrl: './table-ng-ant-design.component.less',
})
export class ReusableTableComponent implements OnInit {
  EIcon = EIcon;
  @Input() tableData: any[] = []; // Data for the table
  @Input() tableColumns: TableColumn[] = []; // Configurable column definitions
  @Input() scrollX: string; // Horizontal scroll size
  @Input() scrollY: string; // Vertical scroll size
  @Input() headerBackground: string = '#f0f2f5';
  @Input() parentHeaderBackground: string = '#4caf50';
  @Input() childHeaderBackground: string = '#f0f2f5';
  @Input() isLoading: boolean = true;
  @Output() onEdit = new EventEmitter<Event>();
  @Output() onCellClickEvent = new EventEmitter<{ data: any; key: string }>(); // Emit cell click event
  headerRows: TableColumn[][] = []; // Processed header rows for rendering
  flattenedColumns: TableColumn[] = []; // Flattened columns for the table body
  columnWidths: string[] = [];

  ngOnInit(): void {
    this.processColumns();
    this.calculateScrollX();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableColumns']) {
      // React to tableColumns changes
      this.processColumns();
    }
  }

  onCellClick(data: any, key: string): void {
    this.onCellClickEvent.emit({ data, key });
  }
  /**
   * Process column configurations to support nested headers.
   */
  private processColumns(): void {
    const [headerRows, flattenedColumns] = this.generateHeaderRows(this.tableColumns);
    this.columnWidths = flattenedColumns.map(col => col.width || '100px');
    this.headerRows = headerRows;
    this.flattenedColumns = flattenedColumns;
    this.calculateLeftPositions();
  }

  private calculateLeftPositions(): void {
    let cumulativeLeft = 0;

    this.flattenedColumns.forEach(column => {
      if (column.fixLeft) {
        column.leftPosition = `${cumulativeLeft}px`; // Set the leftPosition dynamically
        cumulativeLeft += 100; // Assume a fixed column width of 150px
      }
    });
  }
  /**
   * Generate header rows and flatten columns for rendering.
   * @param columns Array of TableColumn definitions.
   * @param level Current level of headers (for recursive processing).
   */
  private generateHeaderRows(columns: TableColumn[], level: number = 0): [TableColumn[][], TableColumn[]] {
    const headerRows: TableColumn[][] = [];
    const flattenedColumns: TableColumn[] = [];
    const queue: { col: TableColumn; level: number }[] = columns.map(col => ({ col, level }));

    while (queue.length) {
      const { col, level } = queue.shift()!;
      if (!headerRows[level]) {
        headerRows[level] = [];
      }

      headerRows[level].push(col);

      if (col.children && col.children.length > 0) {
        queue.push(...col.children.map(child => ({ col: child, level: level + 1 })));
      } else {
        flattenedColumns.push(col);
      }
    }

    return [headerRows, flattenedColumns];
  }

  private calculateScrollX(): void {
    const totalColumnWidth = this.flattenedColumns.reduce((sum, col) => sum + parseInt(col.width || '50', 10), 0);
    this.scrollX = `${totalColumnWidth}px`;
  }
  private evaluateKey(key: string, context: any): any {
    try {
      // Use Function constructor to safely evaluate expressions
      const evaluator = new Function(...Object.keys(context), `return ${key};`);
      return evaluator(...Object.values(context));
    } catch (error) {
      console.error('Error evaluating key:', key, error);
      return null;
    }
  }
  getNestedValue(data: any, key: string): any {
    if (key.includes('?')) {
      return this.evaluateKey(key, data);
    }
    return key.split('.').reduce((acc, part) => (acc ? acc[part] : null), data);
  }
}
