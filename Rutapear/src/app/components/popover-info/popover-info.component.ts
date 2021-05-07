import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonCheckbox, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  @Input() activarHistorico
  @Input() activarFavoritos

  checkedHistoricos:boolean
  checkedFavoritos:boolean

  constructor(
    private popover:PopoverController
  ) { }

  ngOnInit() {

    //AL ACCEDER LOS FILTROS LES PASAMOS DESDE EL COMPONENTE LAS VARIABLES DE ESTADO

    if(this.activarHistorico){
      this.checkedHistoricos = true;
    }
    else{
      this.checkedHistoricos = false;
    }

    if(this.activarFavoritos){
      this.checkedFavoritos = true;
    }
    else{
      this.checkedFavoritos = false;
    }
  }

  //RECOGE EL VALOR DEL CHECKBOX AL CAMBIAR

  valorCheckboxHistoricos(event){
    this.checkedHistoricos = event.detail.checked
  }

  valorCheckboxFavoritos(event){
    this.checkedFavoritos = event.detail.checked
  }

  //CERRAR SIN DATOS (CANCELAR)

  cerrarPopover(){
    this.popover.dismiss();
  }

  //CERRAR CON DATOS (APLICAR)

  aplicarCheckbox(){
    this.popover.dismiss([this.checkedHistoricos, this.checkedFavoritos]);
  }

  

}
