import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverdueDirective } from './overdue.directive';
import { RelativeDuePipe } from './relative-due.pipe';
import { TagChipComponent } from './tag-chip.component';

@NgModule({
  declarations: [OverdueDirective, RelativeDuePipe, TagChipComponent],
  imports: [CommonModule],
  exports: [CommonModule, OverdueDirective, RelativeDuePipe, TagChipComponent],
})
export class SharedModule {}
