import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

/** Chip colorée : `<zn-tag-chip [color]="tag.color">{{ tag.label }}</zn-tag-chip>` (projection de contenu). */
@Component({
  selector: 'zn-tag-chip',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  template: '<ng-content></ng-content>',
})
export class TagChipComponent {
  @Input() color = '#64748b';

  @HostBinding('class.tag') readonly isTag = true;

  @HostBinding('style.background')
  get background(): string {
    return this.color;
  }
}
