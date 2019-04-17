import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-printed-invoices',
  templateUrl: './printed-invoices.page.html',
  styleUrls: ['./printed-invoices.page.scss'],
})
export class PrintedInvoicesPage implements OnInit {

  searchInput: string;

  constructor() { }

  ngOnInit() {
  }

  filter(event) {
    console.log(this.searchInput);
  }

}
