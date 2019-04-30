import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-printed-invoices',
  templateUrl: './printed-invoices.page.html',
  styleUrls: ['./printed-invoices.page.scss'],
})
export class PrintedInvoicesPage implements OnInit {

  searchInput: string;
  @ViewChild('contentToConvert') toConvert: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  filter(event) {
    console.log(this.searchInput);
  }

}
