import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-server-page',
  templateUrl: './error-server-page.component.html',
  styleUrls: ['./error-server-page.component.scss']
})
export class ErrorServerPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      console.log('hehe');
  }

}
