import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  input,
  signal,
  ViewEncapsulation,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { TanStackField } from '@tanstack/angular-form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subject, takeUntil } from 'rxjs';

import { EFormRuleType, EFormType } from '@/enums';
import type { IForm, TRuleValidation } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
import { Info } from './info';
import { buildProps, mapRule } from './util';

@Component({
  selector: '[Field]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NzSpinModule, TanStackField, Info],
  template: `
    <ng-container
      *ngTemplateOutlet="
        component;
        context: {
          state: state(),
          form: form(),
          item: item(),
          t: t(),
          name: name(),
          translatePage: translatePage(),
          isChild: isChild(),
        }
      "
    >
    </ng-container>
    <ng-template
      #component
      let-state="state"
      let-form="form"
      let-item="item"
      let-t="t"
      let-name="name"
      let-translatePage="translatePage"
      let-isChild="isChild"
    >
      <ng-container
        *ngIf="state.validators"
        [tanstackField]="form"
        [name]="name"
        #field="field"
        [validators]="$any(state.validators)"
      >
        <label [title]="state.otherProps.label" class="text-base-content" [for]="field.api.name"
          >{{ state.otherProps?.label }}<span *ngIf="state.otherProps.required" class="text-error"> *</span></label
        >
        {{ handleAddClass(field.api.state.meta) }}
        <div
          Info
          [field]="field"
          [formItem]="item.formItem"
          [t]="t"
          [translatePage]="translatePage"
          [form]="form"
          [meta]="field.api.state.meta"
          [title]="item.title"
          [value]="field.api.state.value"
          [name]="name"
          [isChild]="isChild"
        ></div>
      </ng-container>
    </ng-template>
  `,
})
export class Field implements OnInit, OnDestroy {
  readonly form = input<any>();
  readonly t = input<any>();
  readonly item = input.required<IForm>();
  readonly index = input<number>();
  readonly name = input.required<string>();
  readonly values = input<any>();
  readonly isLabel = input<boolean>();
  readonly translatePage = input<any>();
  readonly isChild = input<boolean>(false);

  readonly destroyed$ = new Subject<void>();
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  readonly state = signal<any>({
    validators: true,
    otherProps: true,
    listClass: ['item col-span-12'],
  });
  constructor(
    @Inject(ElementRef) private readonly el: ElementRef<HTMLButtonElement>,
    @Inject(ChangeDetectorRef) private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.init();
    this.t()
      .onLangChange.pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.init();
        this.cdr.detectChanges();
      });
  }

  init = () => {
    const { t, name, form, values } = this;
    const item = { ...this.item() };
    const state: any = {};
    state.listClass = [
      'item col-span-12',
      'type-' + (item?.formItem?.type ?? EFormType.Text),
      'sm:col-span-' + (item?.formItem?.col ?? 12),
    ];
    item.title = this.translatePage().instant(item.title);

    const rules: TRuleValidation[] = [];
    if (item.formItem?.rules) {
      item.formItem?.rules.filter(item => !!item).map(rule => mapRule({ rule, rules, item: item as IForm, t }));
    }
    if (!item.formItem?.notDefaultValid)
      switch (item.formItem?.type) {
        case EFormType.Number:
          rules.push(({ value }) => {
            // eslint-disable-next-line
            if (!value || (/^-?[1-9]*\d+(\.\d{1,2})?$/.test(value) && parseInt(value) < 1000000000)) return '';
            return t().instant('PleaseEnterOnlyNumber');
          });
          break;
        case EFormType.Password:
          rules.push(({ value }) => {
            if (
              !value ||
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%)(_^&*+-])[A-Za-z\d#?!@$%)(_^&*+-]{8,20}$/.test(value)
            ) {
              return '';
            } else return t().instant('PasswordNeedsToHaveAtLeast8Characters');
          });
          break;
        case EFormType.OnlyNumber:
          rules.push(({ value }) => {
            if (!value || /^\d+$/.test(value)) return '';
            return t().instant('PleaseEnterOnlyNumber');
          });
          break;
        case EFormType.Otp:
          rules.push(({ value }) => {
            const maxLength = 6;
            if (value && value.length < maxLength)
              return t().instant('PleaseEnterAtLeastCharacters', { min: maxLength });
            return '';
          });
          break;
        default:
      }

    /**
     * Generates the otherProps object for the form component.
     *
     * @param item - The item object.
     * @param name - The name of the item.
     * @param rules - The validation rules for the item.
     * @returns The otherProps object.
     */
    state.otherProps = buildProps({ item: item as IForm, name: name(), rules });
    const ruleApi = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.Api);
    const ruleCheckExists = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.CheckExists);

    state.validators = {
      onChange: ({ value }) => {
        let message = '';
        state.otherProps.rules.forEach((rule: any) => {
          if (!message) message = rule({ value, form: form() });
        });
        return message;
      },
      onChangeAsyncDebounceMs: 800,
      onBlurAsync:
        ruleApi?.api?.key || ruleCheckExists?.api?.key
          ? async ({ value }) => {
              if (ruleApi) {
                const res: any = await API.get({
                  url: `${C_API[ruleApi.api!.key]}/${ruleApi.api!.url}`,
                  params: { type: ruleApi.api!.name, value, id: ruleApi.api!.id },
                });
                if (res?.data?.exists === true) {
                  return t().instant('IsAlreadyTaken', { label: ruleApi.api!.label, value });
                }
              } else if (ruleCheckExists) {
                const local = JSON.parse(localStorage.getItem(KEY_DATA[ruleCheckExists.api!.key]) ?? '{}');
                if (!local.isLatest)
                  try {
                    const result = await API.get<any>({
                      url: `${C_API[ruleCheckExists.api!.key]}`,
                      params: { latestUpdated: local.data?.[0]?.updatedAt },
                    });
                    local.data = [...result.data, ...local.data];
                    localStorage.setItem(
                      KEY_DATA[ruleCheckExists.api!.key],
                      JSON.stringify({ data: local.data, isLatest: true }),
                    );
                  } catch (e) {
                    console.log(e);
                  }

                if (local.data.length && ruleCheckExists.api?.name) {
                  const arrayList = ruleCheckExists.api?.name.split('.');
                  let isCheckExists = false;
                  local.data.forEach(element => {
                    if (!isCheckExists && arrayList.length === 1) {
                      isCheckExists = element[arrayList[0]] === value;
                    } else if (!isCheckExists && arrayList.length > 1) {
                      element[arrayList[0]].forEach(item => {
                        if (!isCheckExists && arrayList.length === 2)
                          isCheckExists = item[arrayList[1]] === value && item.id !== values().id;
                      });
                    }
                  });
                  if (isCheckExists) return t().instant('IsAlreadyTaken', { label: ruleCheckExists.api.label, value });
                }
              }
            }
          : null,
    };
    this.state.update(old => ({ ...old, ...state }));
  };

  handleAddClass = meta => {
    this.el.nativeElement.setAttribute(
      'class',
      [...this.state().listClass, meta.errors.length || meta.isValidating ? 'error' : ''].join(' '),
    );
  };
}
