import { CommonModule } from '@angular/common';
import type { TemplateRef } from '@angular/core';
import { Component, ElementRef, EventEmitter, Inject, input, Output, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { type FormApi, injectForm, injectStore } from '@tanstack/angular-form';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import type { IForm } from '@/interfaces';
import { explicitEffect, TFunction } from '@/utils/angular';
import { convertFormValue } from './convert';
import { Field } from './field';

@Component({
  selector: '[CForm]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslateModule, CommonModule, NzSpinModule, Field],
  template: `
    <nz-spin [nzSpinning]="isLoading()">
      <input type="submit" hidden *ngIf="isEnterSubmit()" />
      <ng-template ngFor let-item [ngForOf]="columns()" let-index="index">
        <div
          Field
          [item]="item"
          [index]="index"
          [name]="item.name"
          [t]="t"
          [form]="form"
          [values]="values()"
          [translatePage]="translatePage()"
        ></div>
      </ng-template>
    </nz-spin>
    <ng-container [ngTemplateOutlet]="footer() ?? null" [ngTemplateOutletContext]="{ canSubmit, form }"></ng-container>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class CForm {
  readonly values = input<any>();
  readonly className = input<string>('');
  readonly columns = input.required<IForm[]>();
  readonly isLoading = input<boolean>();
  readonly isEnterSubmit = input<boolean>();
  readonly footer = input<TemplateRef<unknown>>();
  readonly translatePage = input<any>();

  @Output() onSubmit = new EventEmitter<{ value: any; formApi: FormApi<any, any> }>();

  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>,
    @Inject(TranslateService) public t: TFunction,
  ) {
    this.t.prefix = 'Components';

    const listClass = ['c-form', this.className()];
    this.el.nativeElement.setAttribute('class', listClass.join(' '));
    this.el.nativeElement.onsubmit = e => {
      e.preventDefault();
      e.stopPropagation();
      this.form.handleSubmit();
    };
    explicitEffect([this.columns, this.values], ([columns, values]) => {
      this.form.reset();
      if (columns?.length)
        this.form.update({
          ...this.form.options,
          defaultValues: convertFormValue(columns, values ?? {}, false),
        });
    });
  }

  handleSubmit = ({ value }) => {
    this.onSubmit.emit({ value: convertFormValue(this.columns() ?? [], value ?? '', true), formApi: this.form });
  };
  form = injectForm({
    onSubmit: this.handleSubmit,
  });

  canSubmit = injectStore(this.form, state => state.canSubmit);
}
