import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonCheckbox, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  @Input() activarHistorico

  checked:boolean

  constructor(
    private popover:PopoverController
  ) { }

  ngOnInit() {

    //SI ACCEDEMOS MEDIANTE HISTORICO O NO, PONEMOS POR DEFECTO UN VALOR

    if(this.activarHistorico){
      this.checked = true;
    }
    else{
      this.checked = false;
    }
  }

  //RECOGE EL VALOR DEL CHECKBOX AL CAMBIAR

  valorCheckbox(event){
    this.checked = event.detail.checked
  }

  //CERRAR SIN DATOS (CANCELAR)

  cerrarPopover(){
    this.popover.dismiss();
  }

  //CERRAR CON DATOS (APLICAR)

  aplicarCheckbox(){
    this.popover.dismiss(this.checked);
  }

  

}
