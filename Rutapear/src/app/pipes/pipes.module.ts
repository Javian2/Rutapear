import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroRutaPipe } from './filtro-ruta.pipe';
import { FiltroEstablecimientoPipe } from './filtro-establecimiento.pipe';



@NgModule({
  declarations: [FiltroRutaPipe, FiltroEstablecimientoPipe],
  exports: [FiltroRutaPipe, FiltroEstablecimientoPipe]
})
export class PipesModule { }