import { Component, computed, Inject, NO_ERRORS_SCHEMA, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CChart } from '@/components/chart';
import { CForm } from '@/components/form';
import { EButtonSize, EFormType } from '@/enums';
import type { IForm } from '@/interfaces';
import { TFunction } from '@/utils/angular';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
@Component({
  selector: 'page-chart',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CChart, NzDropDownModule, CForm],
  templateUrl: './index.component.html',
  // template: `
  //   <div class="intro-x">
  //   <div>
  //     <app-breadcrumbs
  //       title="Summary of quality values of Trancom project"
  //       [list]="['Project Managerment', 'Summary of quality values']"
  //     ></app-breadcrumbs>
  //     <form
  //       CForm
  //       [columns]="columns()"
  //       [footer]="footer"
  //       [isEnterSubmit]="true"
  //       (onSubmit)="handleSubmit($event)"
  //       [translatePage]="t"
  //     >
  //       <ng-template #footer let-canSubmit="canSubmit" let-form="form">
  //         <div class="flex justify-between">
  //           <div class="flex flex-row gap-2">
  //             <button
  //               CButton
  //               [size]="EButtonSize.Small"
  //               [text]="'Add'"
  //               (click)="form.handleSubmit()"
  //               [disabled]="!canSubmit()"
  //             ></button>
  //             <button
  //               CButton
  //               [size]="EButtonSize.Small"
  //               [text]="'Export Excel'"
  //               (click)="form.handleSubmit()"
  //               [disabled]="!canSubmit()"
  //             ></button>
  //           </div>
  //           <div class="flex flex-row gap-2">
  //             <button CButton [size]="EButtonSize.Small" [text]="'Search'" (click)="handleSearch(form)"></button>
  //             <button
  //               CButton
  //               [size]="EButtonSize.Small"
  //               [text]="'Clear'"
  //               (click)="handleClear(form)"
  //               [disabled]="!canSubmit()"
  //             ></button>
  //           </div>
  //         </div>
  //       </ng-template>
  //     </form>
  //   </div>

  //     <div class="max-w-screen mt-14 flex gap-3">
  //       <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu"></div>
  //       <nz-dropdown-menu #menu="nzDropdownMenu">
  //         <ul nz-menu>
  //           <li nz-menu-item (click)="handleMenuClick(1)" [style.background]="threshold == 1 ? 'green' : ''">
  //             Trên ngưỡng
  //           </li>
  //           <li nz-menu-item (click)="handleMenuClick(2)" [style.background]="threshold == 2 ? 'green' : ''">
  //             Dưới ngưỡng
  //           </li>
  //           <li nz-menu-item (click)="handleMenuClick(0)" [style.background]="threshold == 0 ? 'green' : ''">
  //             Bằng ngưỡng
  //           </li>
  //         </ul>
  //       </nz-dropdown-menu>

  //       <div class="relative w-1/2 rounded-md border border-solid py-3 pr-3">
  //         <div CChart [options]="chartOptions"></div>
  //         <button class="absolute right-3 top-3" nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
  //           <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
  //             <path
  //               d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
  //             />
  //           </svg>
  //         </button>
  //       </div>
  //       <div class="ml-24 w-1/2 pt-5">
  //         <div CChart [options]="optionPie"></div>
  //       </div>
  //     </div>
  //     <div class="mt-14 flex w-full flex-wrap">
  //       <div class="w-1/3">
  //         <div CChart [options]="option"></div>
  //       </div>
  //       <div class="w-1/3">
  //         <div CChart [options]="phaseDetail"></div>
  //       </div>
  //       <div class="w-1/3">
  //         <div CChart [options]="phaseDetail"></div>
  //       </div>
  //       <div class="w-1/3">
  //         <div CChart [options]="option"></div>
  //       </div>
  //       <div class="w-1/3">
  //         <div CChart [options]="phaseDetail"></div>
  //       </div>
  //       <div class="w-1/3">
  //         <div CChart [options]="phaseDetail"></div>
  //       </div>
  //     </div>
  //   </div>
  // `,
  providers: [{ provide: TranslateService, useClass: TFunction }, SGlobal],
  schemas: [NO_ERRORS_SCHEMA],
})
export class PageChart {
  constructor(@Inject(TranslateService) readonly t: TFunction) {}
  EButtonSize = EButtonSize;
  listOfData: any[] = [];
  dataProject: any = {};
  listOfSearch: any[] = [];
  threshold: number = 1;
  chartOptions: any;
  labelBarChart: string;
  columns = computed<IForm[]>(() => [
    {
      name: 'Phase',
      title: 'Phase',
      formItem: {
        col: 4,
        type: EFormType.Select,
        isMultiple: true,
        list: this.listPhase,
      },
    },
    {
      name: 'Project',
      title: 'Project',
      formItem: {
        col: 4,
        type: EFormType.Select,
        list: this.listProject,
      },
    },
  ]);
  listPhase = [
    { label: 'management', value: '1' },
    { label: 'requirementDefinition', value: '2' },
    { label: 'programming', value: '3' },
  ];
  listProject = [
    { label: 'project', value: 'project' },
    { label: 'Project 1', value: 'project 1' },
    { label: 'Project 3', value: '3' },
    { label: 'Project 4', value: '4' },
    { label: 'Project 5', value: '5' },
    { label: 'Project 6', value: '6' },
    { label: 'Project 7', value: '7' },
    { label: 'Project 8', value: '8' },
    { label: 'Project 9', value: '9' },
  ];

  ngOnInit(): void {
    this.initialBarChart();
  }
  initialBarChart = () => {
    const data = [
      {
        id_project: 1,
        project: 'Trancom',
        threshold: [
          {
            name: 'Management',
            min: 2,
            max: 3,
            euqal: 4,
          },
          {
            name: 'basic design',
            min: 2,
            max: 3,
            euqal: 4,
          },
        ],
      },
    ];
    this.chartOptions = {
      title: {
        text: `Biểu đồ thống kê mức độ ${this.threshold == 1 ? 'cao' : this.threshold == 2 ? 'dưới' : 'bằng'} ngưỡng của project ${data[0].project}`,
        left: 'center',
      },
      tooltip: {},

      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {},
      series: [
        {
          name: 'Doanh số',
          type: 'bar',
          data: [
            120,
            {
              value: 200,
              itemStyle: {
                color: '#a90000',
              },
            },
            150,
            80,
            70,
            110,
            130,
          ],
        },
      ],
    };
  };
  handleClick = () => {
    console.log('click');
    this.chartOptions = {
      title: {
        text: 'Biểu đồ ECharts trong Angular',
      },
      tooltip: {},
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {},
      series: [
        {
          name: 'Doanh số',
          type: 'bar',
          data: [
            120,
            {
              value: 200,
              itemStyle: {
                color: '#a90000',
              },
            },
            150,
            80,
            70,
            110,
            {
              value: 110,
              itemStyle: {
                color: '#a90000',
              },
            },
          ],
        },
      ],
    };
  };

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    toolbox: {
      // feature: {
      //   dataView: { show: true, readOnly: false },
      //   magicType: { show: true, type: ['line', 'bar'] },
      //   restore: { show: true },
      //   saveAsImage: { show: true },
      // },
    },
    legend: {
      data: ['Evaporation', 'Precipitation', 'Temperature'],
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml',
        },
      },
      {
        type: 'value',
        name: 'Temperature',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} °C',
        },
      },
    ],
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          },
        },
        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
      },
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          },
        },
        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
      },
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' °C';
          },
        },
        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
      },
    ],
  };

  optionPie = {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  phaseDetail = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
      },
    ],
  };

  handleMenuClick(value: any) {
    this.threshold = value;
    console.log('value', value);
    // this.handleThresholdDashboard(value);
  }
  handleSubmit = (event: any) => {
    const { value } = event;
    // this.data$ = this.sGlobal.data;
    // this.sGlobal.data.subscribe(item => (this.dataProject = item.data));
    console.log('value', value);
  };
  handleClear = (form: any) => {
    if (form) {
      form.reset();
    }
  };
  handleSearch = (form: any) => {
    const projectValue = form.getFieldValue('Project');
    console.log('project', projectValue);
    if (projectValue == '') {
      this.listOfData = this.listOfSearch;
    } else {
      this.listOfSearch = this.listOfData.filter(item => item.project == projectValue);
    }
    // const phaseValue = form.getFieldValue('Phase') || [];
    // if (phaseValue.length === 0) {
    //   this.columnsHeader = this.columnsSearch;
    // }

    // const phaseValueSearch = phaseValue.map(item => this.listPhase.find(i => i.value === item)?.label); // Remove undefined values
    // this.columnsSearch = this.columnsHeader.filter(i => {
    //   return phaseValueSearch.length === 0 || !phaseValueSearch.includes(i.title);
    // });
  };
}
