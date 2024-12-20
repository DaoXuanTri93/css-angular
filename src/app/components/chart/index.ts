import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
  ViewEncapsulation,
  type AfterViewInit,
  type OnChanges,
  type OnInit,
  type Renderer2,
  type SimpleChanges,
} from '@angular/core';
import 'default-passive-events';
import * as echarts from 'echarts';
@Component({
  selector: '[CChart]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `<div #chartContainer style="width: 100%;height:500px;"></div>`,
  styleUrl: './index.less',
})
export class CChart implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  @Input() options: any = {};
  private chartInstance: any;

  private resizeListener: () => void;

  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<HTMLDivElement>,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      this.updateChart();
    }
  }

  ngAfterViewInit(): void {
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.chartInstance?.resize();
    });
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private initChart(): void {
    this.chartInstance = echarts.init(this.chartContainer.nativeElement);
    this.updateChart();
  }

  private updateChart(): void {
    if (this.chartInstance && this.options) {
      this.chartInstance.setOption(this.options);
    }
  }
}
