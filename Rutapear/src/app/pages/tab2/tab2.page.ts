import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    private router:Router
  ) {}

  ngOnInit(){
  }

  ionViewDidEnter(){
    /* this.router.navigate(['/tabs/tab1']) */
  }

}
