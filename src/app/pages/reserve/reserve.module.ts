import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservePageRoutingModule } from './reserve-routing.module';

import { ReservePage } from './reserve.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ReservePageRoutingModule
  ],
  declarations: [ReservePage]
})
export class ReservePageModule {}
