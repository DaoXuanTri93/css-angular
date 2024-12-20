import { Component, effect, inject, Inject, type OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BreadcrumbsComponent } from '@/components/breadcrumbs/breadcrumbs.component';
import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import {
  ReusableTableComponent,
  type TableColumn,
} from '@/components/table-ng-ant-design/table-ng-ant-design.component';
import { EButtonSize, EFormType, EIcon } from '@/enums';
import type { IForm } from '@/interfaces';
import type { IQualityManagement } from '@/interfaces/model';
import { SGlobal } from '@/services/global';
import { SLocal } from '@/services/local';
import { TFunction } from '@/utils/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getState } from '@ngrx/signals';

@Component({
  selector: 'summary-quality',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CButton, CForm, BreadcrumbsComponent, CForm, ReusableTableComponent, CommonModule],
  templateUrl: './index.component.html',
  providers: [{ provide: TranslateService, useClass: TFunction }, SGlobal],
})
export class SummaryQualityComponent implements OnInit {
  public readonly sLocal = inject(SLocal<IQualityManagement>('QualityList'));
  EButtonSize = EButtonSize;
  listOfSearch: IQualityManagement[] = [];
  listOfData: IQualityManagement[] = [];
  columnsHeader: TableColumn[] = [];
  columnsSearch: TableColumn[] = [];
  initColumns: TableColumn[] = [];
  additionalColumns: TableColumn[] = [];
  additionalColumnsDynamic: TableColumn[] = [];
  listProject: any[] = [];
  listPhase: any[] = [];
  columnsForm: IForm[] = [];
  isLoading: boolean | undefined;
  constructor(
    @Inject(TranslateService) readonly t: TFunction,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Pages.Base.Quality';
    this.sLocal.get();
    effect(
      () => {
        const slocal = getState(this.sLocal);
        this.isLoading = slocal.isLoading;
        this.listOfSearch = this.listOfData = slocal.result?.data as IQualityManagement[];
        if (slocal.result) {
          this.listProject = [...new Set(this.listOfData.filter(item => item.projectName).map(item => item.projectName))].map(
            project => ({
              label: project,
              value: project,
            }),
          );

          this.columnsForm = [
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
                col: 2,
                type: EFormType.Select,
                list: this.listProject,
              },
            },
          ];
        }
      },
      { allowSignalWrites: true },
    );
  }
  ngOnInit(): void {
    this.initColumns = [
      {
        title: 'Edit',
        key: 'Edit',
        rowspan: 2,
        fixLeft: true,
        icon: EIcon.Edit,
        clickable: true,
      },
      {
        title: 'Project',
        key: 'projectName',
        rowspan: 2,
        fixLeft: true,
      },
      {
        title: 'Work Content',
        key: 'workContent',
        rowspan: 2,
        fixLeft: true,
      },
      {
        title: 'Management',
        colspan: 2,
        children: [
          { title: 'Man Hours', key: 'management.manHours', rowspan: 2 },
          {
            title: 'Reference Value Exceeded',
            key: 'management.manHoursRVE == 0 ? null : management.manHoursRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
    ];

    this.additionalColumnsDynamic = this.additionalColumns = [
      {
        title: 'Requirement Definition',
        colspan: 12, // Indicates nested headers
        children: [
          { title: 'Man Hours', key: 'requirementDefinition.manHours', rowspan: 2 },
          { title: 'Man Hours For Review', key: 'requirementDefinition.manHoursForReview', rowspan: 2 },
          { title: 'Man Hours For Translation', key: 'requirementDefinition.manHoursForTranslation', rowspan: 2 },
          { title: 'Number Of Pages', key: 'requirementDefinition.numberOfPages', rowspan: 2 },
          {
            title: 'Number Of Comments Reviews',
            key: 'requirementDefinition.numberOfCommentsReviews',
            rowspan: 2,
          },
          { title: 'Number Of QAs', key: 'requirementDefinition.numberOfQAs', rowspan: 2 },
          {
            title: 'Requirement Definition Review Correction',
            key: 'requirementDefinition.requirementDefinitionReviewCorrection',
            rowspan: 2,
          },
          {
            title: 'Requirement Definition Review Correction RVE',
            key: 'requirementDefinition.requirementDefinitionReviewCorrectionRVE == 0 ? null : requirementDefinition.requirementDefinitionReviewCorrectionRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Requirement Definition Number Pages',
            key: 'requirementDefinition.requirementDefinitionNumberPages',
            rowspan: 2,
          },
          {
            title: 'Requirement Definition Number Pages RVE',
            key: 'requirementDefinition.requirementDefinitionNumberPagesRVE == 0 ? null : requirementDefinition.requirementDefinitionNumberPagesRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Requirement Definition Pointing Out Rate',
            key: 'requirementDefinition.requirementDefinitionPointingOutRate',
            rowspan: 2,
          },
          {
            title: 'Requirement Definition Pointing Out Rate RVE',
            key: 'requirementDefinition.requirementDefinitionPointingOutRateRVE == 0 ? null : requirementDefinition.requirementDefinitionPointingOutRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'Programming',
        colspan: 16, // Indicates nested headers
        children: [
          { title: 'Man Hours', key: 'programming.manHours', rowspan: 2 },
          { title: 'Man Hours For Review', key: 'programming.manHoursForReview', rowspan: 2 },
          { title: 'Man Hours For Translation', key: 'programming.manHoursForTranslation', rowspan: 2 },
          { title: 'Number Of Steps', key: 'programming.numberOfSteps', rowspan: 2 },
          {
            title: 'Number Of Comments Reviews',
            key: 'programming.numberOfCommentsReviews',
            rowspan: 2,
          },
          { title: 'Number Of QAs', key: 'programming.numberOfQAs', rowspan: 2 },
          {
            title: 'Programming Implementation Man Hours',
            key: 'programming.programmingImplementationManHours',
            rowspan: 2,
          },
          {
            title: 'Programming Implementation Man Hours RVE',
            key: 'programming.programmingImplementationManHoursRVE == 0 ? null : programming.programmingImplementationManHoursRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Programming Hour Number Steps',
            key: 'programming.programmingHourNumberSteps',
            rowspan: 2,
          },
          {
            title: 'Programming Hour Number Steps RVE',
            key: 'programming.programmingHourNumberStepsRVE == 0 ? null : programming.programmingHourNumberStepsRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Programming Review Correction',
            key: 'programming.programmingReviewCorrection',
            rowspan: 2,
          },
          {
            title: 'Programming Review Correction RVE',
            key: 'programming.programmingReviewCorrectionRVE == 0 ? null : programming.programmingReviewCorrectionRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Programming Number Steps Pointing Out Rate',
            key: 'programming.programmingNumberStepsPointingOutRate',
            rowspan: 2,
          },
          {
            title: 'Programming Number Steps Pointing Out Rate RVE',
            key: 'programming.programmingNumberStepsPointingOutRateRVE == 0 ? null : programming.programmingNumberStepsPointingOutRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Programming Review Man Hours Identification Rate',
            key: 'programming.programmingReviewManHoursIdentificationRate',
            rowspan: 2,
          },
          {
            title: 'Programming Review Man Hours Identification Rate RVE',
            key: 'programming.programmingReviewManHoursIdentificationRateRVE == 0 ? null : programming.programmingReviewManHoursIdentificationRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'Basic Design',
        colspan: 14,
        children: [
          { title: 'Man Hours', key: 'basicDesign.manHours', rowspan: 2 },
          { title: 'Man Hours For Review', key: 'basicDesign.manHoursForReview', rowspan: 2 },
          { title: 'Man Hours For Translation', key: 'basicDesign.manHoursForTranslation', rowspan: 2 },
          { title: 'Number Of Pages', key: 'basicDesign.numberOfPages', rowspan: 2 },
          {
            title: 'Number Of Comments Reviews',
            key: 'basicDesign.numberOfCommentsReviews',
            rowspan: 2,
          },
          { title: 'Number Of QAs', key: 'basicDesign.numberOfQAs', rowspan: 2 },
          {
            title: 'Basic Design Review Correction',
            key: 'basicDesign.basicDesignReviewCorrection',
            rowspan: 2,
          },
          {
            title: 'Basic Design Review Correction RVE',
            key: 'basicDesign.basicDesignReviewCorrectionRVE == 0 ? null : basicDesign.basicDesignReviewCorrectionRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Basic Design Number Pages',
            key: 'basicDesign.basicDesignNumberPages',
            rowspan: 2,
          },
          {
            title: 'Basic Design Number Pages RVE',
            key: 'basicDesign.basicDesignNumberPagesRVE == 0 ? null : basicDesign.basicDesignNumberPagesRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Basic Design Pointing Out Rate',
            key: 'basicDesign.basicDesignPointingOutRate',
            rowspan: 2,
          },
          {
            title: 'Basic Design Pointing Out Rate RVE',
            key: 'basicDesign.basicDesignPointingOutRateRVE == 0 ? null : basicDesign.basicDesignPointingOutRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Basic Design Translation Man Hour',
            key: 'basicDesign.basicDesignTranslationManHour',
            rowspan: 2,
          },
          {
            title: 'Basic Design Translation Man Hour RVE',
            key: 'basicDesign.basicDesignTranslationManHourRVE == 0 ? null : basicDesign.basicDesignTranslationManHourRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'Detail Design',
        colspan: 14,
        children: [
          { title: 'Man Hours', key: 'detailDesign.manHours', rowspan: 2 },
          { title: 'Man Hours For Review', key: 'detailDesign.manHoursForReview', rowspan: 2 },
          { title: 'Man Hours For Translation', key: 'detailDesign.manHoursForTranslation', rowspan: 2 },
          { title: 'Number Of Pages', key: 'detailDesign.numberOfPages', rowspan: 2 },
          {
            title: 'Number Of Comments Reviews',
            key: 'detailDesign.numberOfCommentsReviews',
            rowspan: 2,
          },
          { title: 'Number Of QAs', key: 'detailDesign.numberOfQAs', rowspan: 2 },
          {
            title: 'Detail Design Review Correction',
            key: 'detailDesign.detailDesignReviewCorrection',
            rowspan: 2,
          },
          {
            title: 'Detail Design Review Correction RVE',
            key: 'detailDesign.detailDesignReviewCorrectionRVE == 0 ? null : detailDesign.detailDesignReviewCorrectionRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Detail Design Number Pages',
            key: 'detailDesign.detailDesignNumberPages',
            rowspan: 2,
          },
          {
            title: 'Detail Design Number Pages RVE',
            key: 'detailDesign.detailDesignNumberPagesRVE == 0 ? null : detailDesign.detailDesignNumberPagesRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Detail Design Pointing Out Rate',
            key: 'detailDesign.detailDesignPointingOutRate',
            rowspan: 2,
          },
          {
            title: 'Detail Design Pointing Out Rate RVE',
            key: 'detailDesign.detailDesignPointingOutRateRVE == 0 ? null : detailDesign.detailDesignPointingOutRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Detail Design Translation Man Hour',
            key: 'detailDesign.detailDesignTranslationManHour',
            rowspan: 2,
          },
          {
            title: 'Detail Design Translation Man Hour RVE',
            key: 'detailDesign.detailDesignTranslationManHourRVE == 0 ? null : detailDesign.detailDesignTranslationManHourRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'System Test',
        colspan: 10, // Indicates nested headers
        children: [
          { title: 'Man Hours', key: 'systemTest.manHours', rowspan: 2 },
          { title: 'Number Of Bug', key: 'systemTest.numberOfBug', rowspan: 2 },
          { title: 'Number Of Test Case', key: 'systemTest.numberOfTestCase', rowspan: 2 },
          { title: 'Point To Note', key: 'systemTest.pointToNote', rowspan: 2 },
          {
            title: 'System Test Bug Hit Rate',
            key: 'systemTest.systemTestBugHitRate',
            rowspan: 2,
          },
          { title: 'System Test Bug Hit Rate RVE', key: 'systemTest.systemTestBugHitRateRVE', rowspan: 2 },
          {
            title: 'System Test Number Steps Bug Rate',
            key: 'systemTest.systemTestNumberStepsBugRate',
            rowspan: 2,
          },
          {
            title: 'System Test Number Steps Bug Rate RVE',
            key: 'systemTest.systemTestNumberStepsBugRateRVE == 0 ? null : systemTest.systemTestNumberStepsBugRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'System Test Man Hours Identification Rate',
            key: 'systemTest.systemTestManHoursIdentificationRate',
            rowspan: 2,
          },
          {
            title: 'System Test Man Hours Identification Rate RVE',
            key: 'systemTest.systemTestManHoursIdentificationRateRVE == 0 ? null : systemTest.systemTestManHoursIdentificationRateRVE  == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'Unit Test',
        colspan: 10, // Indicates nested headers
        children: [
          { title: 'Man Hours', key: 'unitTest.manHours', rowspan: 2 },
          { title: 'Number Of Bug', key: 'unitTest.numberOfBug', rowspan: 2 },
          { title: 'Number Of Test Case', key: 'unitTest.numberOfTestCase', rowspan: 2 },
          { title: 'Point To Note', key: 'unitTest.pointToNote', rowspan: 2 },
          {
            title: 'Unit Test Bug Hit Rate',
            key: 'unitTest.unitTestBugHitRate',
            rowspan: 2,
          },
          { title: 'Unit Test Bug Hit Rate RVE', key: 'unitTest.unitTestBugHitRateRVE', rowspan: 2 },
          {
            title: 'Unit Test Number Steps Bug Rate',
            key: 'unitTest.unitTestNumberStepsBugRate',
            rowspan: 2,
          },
          {
            title: 'Unit Test Number Steps Bug Rate RVE',
            key: 'unitTest.unitTestNumberStepsBugRateRVE == 0 ? null : unitTest.unitTestNumberStepsBugRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Unit Test Man Hours Identification Rate',
            key: 'unitTest.unitTestManHoursIdentificationRate',
            rowspan: 2,
          },
          {
            title: 'Unit Test Man Hours Identification Rate RVE',
            key: 'unitTest.unitTestManHoursIdentificationRateRVE == 0 ? null : unitTest.unitTestManHoursIdentificationRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
      {
        title: 'Integration Test',
        colspan: 11, // Indicates nested headers
        children: [
          { title: 'Man Hours', key: 'integrationTest.manHours', rowspan: 2 },
          { title: 'Number Of Bug', key: 'integrationTest.numberOfBug', rowspan: 2 },
          { title: 'Number Of Test Case', key: 'integrationTest.numberOfTestCase', rowspan: 2 },
          { title: 'Point To Note', key: 'integrationTest.pointToNote', rowspan: 2 },
          {
            title: 'Number Of Steps',
            key: 'integrationTest.numberOfSteps',
            rowspan: 2,
          },
          { title: 'Integration Test Bug Hit Rate', key: 'integrationTest.integrationTestBugHitRate', rowspan: 2 },
          {
            title: 'Integration Test Bug Hit Rate RVE',
            key: 'integrationTest.integrationTestBugHitRateRVE == 0 ? null : integrationTest.integrationTestBugHitRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Integration Test Number Steps Bug Rate',
            key: 'integrationTest.integrationTestNumberStepsBugRate',
            rowspan: 2,
          },
          {
            title: 'Integration Test Number Steps Bug Rate RVE',
            key: 'integrationTest.integrationTestNumberStepsBugRateRVE == 0 ? null : integrationTest.integrationTestNumberStepsBugRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
          {
            title: 'Integration Test Man Hours Identification Rate',
            key: 'integrationTest.integrationTestManHoursIdentificationRate',
            rowspan: 2,
          },
          {
            title: 'Integration Test Man Hours Identification Rate RVE',
            key: 'integrationTest.integrationTestManHoursIdentificationRateRVE == 0 ? null : integrationTest.integrationTestManHoursIdentificationRateRVE == 1 ? "⯅" : "⯆"',
            rowspan: 2,
          },
        ],
      },
    ];

    this.columnsSearch.push(...this.initColumns, ...this.additionalColumns);

    this.listPhase = this.additionalColumns.map(item => ({
      label: item.title,
      value: item.title,
    }));
  }
  handleSubmit = ({ value }) => {
    // this.router.navigate(['/new-layout'], { queryParams: value });
  };

  handleSearch = (form: any) => {
    // search theo tên Project và phase theo tên
    const projectValue = form.getFieldValue('Project');
    const phaseValue = form.getFieldValue('Phase') || [];
    if (projectValue == '') {
      this.listOfSearch = [...this.listOfData];
    } else {
      this.listOfSearch = this.listOfData.filter(item => item.projectName == projectValue);
    }
    if (phaseValue.length === 0) {
      this.columnsSearch = [...this.initColumns, ...this.additionalColumnsDynamic];
    } else {
      const phaseValueSearch = phaseValue.map(item => this.listPhase.find(i => i.value === item)?.label);
      const filterAddColumn = this.additionalColumns.filter(item => phaseValueSearch.includes(item.title));
      this.columnsSearch = [...this.initColumns, ...filterAddColumn];
    }
  };

  handleClear = (form: any) => {
    if (form) {
      form.reset();
    }
  };

  handleCellClick(event: { data: any; key: string }): void {
    console.log('Cell clicked:', event);
  }
}
