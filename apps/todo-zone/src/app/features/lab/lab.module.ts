import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DefaultCardComponent } from './default-card/default-card.component';
import { LabComponent } from './lab.component';
import { OnPushCardComponent } from './onpush-card/onpush-card.component';

@NgModule({
  declarations: [LabComponent, DefaultCardComponent, OnPushCardComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: LabComponent }]),
  ],
})
export class LabModule {}
