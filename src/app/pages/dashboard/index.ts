import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { getState } from '@ngrx/signals';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EButtonSize, EFormRuleType, EFormType, EStatusState } from '@/enums';
import type { IForm } from '@/interfaces';
import type { IMUser, IMUserRole } from '@/interfaces/model';
import { SGlobal } from '@/services/global';
import { SLocal } from '@/services/local';
import { LINK } from '@/utils';
import { TFunction } from '@/utils/angular';

@Component({
  selector: 'page-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, TranslateModule, CButton, CForm],
  template: ` <div class="intro-x">
    <h1>{{ t.instant('SignIn') }}</h1>
    <h5>{{ t.instant('EnterYourDetailsToLoginToYourAccount') }}</h5>
    <form
      CForm
      [columns]="columns()"
      [footer]="footer"
      [isEnterSubmit]="true"
      (onSubmit)="handleSubmit($event)"
      [isLoading]="sGlobal.isLoading?.() ?? false"
      [translatePage]="t"
    >
      <ng-template #footer let-canSubmit="canSubmit" let-form="form">
        <div class="-mt-2 text-right">
          <button class="text-base-content/60" type="button" [title]="t.instant('LinkForgotPassword')">
            {{ t.instant('LinkForgotPassword') }}
          </button>
          <button
            CButton
            [size]="EButtonSize.Large"
            [text]="t.instant('LogIn')"
            (click)="form.reset()"
            [disabled]="!canSubmit()"
          ></button>
        </div>
      </ng-template>
    </form>
  </div>`,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class PageDashboard {
  EButtonSize = EButtonSize;
  public readonly sGlobal = inject(SGlobal);
  public readonly sLocal = inject(SLocal<IMUser, IMUserRole>('User', 'UserRole'));
  constructor(
    @Inject(TranslateService) readonly t: TFunction,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Pages.Base.Login';
    this.sLocal.get({});
    this.sLocal.getType({});
    effect(
      () => {
        const state = getState(this.sGlobal);
        const slocal = getState(this.sLocal);
        console.log(slocal, slocal.data);
        console.log(slocal, slocal.dataType);
        if (state.status === EStatusState.IsFulfilled && state.user && Object.keys(state.user).length > 0) {
          this.sGlobal.set({ status: EStatusState.Idle });
          this.router.navigate([`/${state.language}${LINK.Dashboard}`], { replaceUrl: true });
        }
      },
      { allowSignalWrites: true },
    );
  }
  columns = computed<IForm[]>(() => [
    {
      name: 'email',
      title: 'Username',
      formItem: {
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      name: 'password',
      title: 'Password',
      formItem: {
        type: EFormType.Password,
        notDefaultValid: true,
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      name: 'select',
      title: 'Select',
      formItem: {
        type: EFormType.Select,
        isMultiple: true,
        list: [
          {
            value: 'value 1',
            label: 'label 1',
          },
          {
            value: 'value 2',
            label: 'label 2',
          },
        ],
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      name: 'checkbox',
      title: 'Checkbox',
      formItem: {
        type: EFormType.Checkbox,
        isMultiple: true,
        list: [
          {
            value: 'value 1',
            label: 'label 1',
          },
          {
            value: 'value 2',
            label: 'label 2',
          },
        ],
        rules: [{ type: EFormRuleType.Required }],
      },
    },
    {
      title: 'Addable Table',
      name: 'addable',
      formItem: {
        type: EFormType.Addable,
        rules: [{ type: EFormRuleType.Required }],
        addable: {
          textAdd: 'Add item',
          onAdd: value => console.log(value),
          isTable: true,
          showRemove: value => {
            console.log(value);
            return true;
          },
          idCheck: true,
        },
        column: [
          {
            title: 'hours',
            name: 'hours',
            formItem: {
              rules: [{ type: EFormRuleType.Required }],
              type: EFormType.Number,
            },
          },
        ],
      },
    },
    {
      title: 'Addable',
      name: 'addable-2',
      formItem: {
        type: EFormType.Addable,
        rules: [{ type: EFormRuleType.Required }],
        addable: {
          textAdd: 'Add item',
          onAdd: value => console.log(value),
          isTable: false,
          showRemove: value => {
            console.log(value);
            return true;
          },
          idCheck: true,
        },
        column: [
          {
            title: 'hours',
            name: 'hours',
            formItem: {
              rules: [{ type: EFormRuleType.Required }],
              type: EFormType.Number,
            },
          },
        ],
      },
    },
  ]);
  handleSubmit = ({ value }) => {
    console.log(value);
  };
}
