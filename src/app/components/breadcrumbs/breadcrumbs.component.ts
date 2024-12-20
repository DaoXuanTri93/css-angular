import { EIcon } from '@/enums';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CSvgIcon } from '../svg-icon';
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CSvgIcon, NgIf, NgFor],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.less',
})
export class BreadcrumbsComponent {
  @Input() title!: string;
  @Input() list!: string[];
  EIcon = EIcon;
}
