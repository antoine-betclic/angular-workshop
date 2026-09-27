import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StatsComponent } from './stats.component';

@NgModule({
  declarations: [StatsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: StatsComponent }]),
  ],
})
export class StatsModule {}
