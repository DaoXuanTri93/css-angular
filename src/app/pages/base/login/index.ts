import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { getState } from '@ngrx/signals';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CButton } from '@/components/button';
import { CForm } from '@/components/form';
import { EButtonSize, EFormRuleType, EFormType, EStatusState } from '@/enums';
import type { IForm } from '@/interfaces';
import { SGlobal } from '@/services/global';
import { LINK } from '@/utils';
import { TFunction } from '@/utils/angular';

@Component({
  selector: 'page-base-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, TranslateModule, CButton, CForm],
  template: `
    <div class="intro-x">
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
              (click)="form.handleSubmit()"
              [disabled]="!canSubmit()"
            ></button>
          </div>
        </ng-template>
      </form>
    </div>
  `,
  providers: [{ provide: TranslateService, useClass: TFunction }],
})
export class PageLogin {
  EButtonSize = EButtonSize;
  public readonly sGlobal = inject(SGlobal);
  constructor(
    @Inject(TranslateService) readonly t: TFunction,
    @Inject(Router) readonly router: Router,
  ) {
    this.t.prefix = 'Pages.Base.Login';
    effect(
      () => {
        const state = getState(this.sGlobal);
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
      name: 'username',
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
  ]);
  handleSubmit = ({ value }) => {
    this.sGlobal.postLogin(value);
  };
}
