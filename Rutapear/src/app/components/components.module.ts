import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapaComponent } from './mapa/mapa.component';
import { PopoverInfoComponent } from './popover-info/popover-info.component';



@NgModule({
  declarations: [
    MapaComponent,
    PopoverInfoComponent
  ],
  exports: [
    MapaComponent,
    PopoverInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
