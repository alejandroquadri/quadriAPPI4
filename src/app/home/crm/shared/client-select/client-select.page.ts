import { Component, OnInit } from '@angular/core';

import { CrmService } from '../crm.service';
import { WordFilterPipe } from '../../../../shared';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-client-select',
  templateUrl: './client-select.page.html',
  styleUrls: ['./client-select.page.scss'],
})
export class ClientSelectPage implements OnInit {

  searchInput = '';
  clientsObs: any;
  clientsList: any;
  filteredClients;

  constructor(
    public navParams: NavParams,
    private filterPipe: WordFilterPipe,
    public modalCtrl: ModalController,
    private crmData: CrmService
  ) { }

  ngOnInit() {
    this.clientsObs = this.crmData.getClients();
    this.clientsObs.subscribe( clients => {
      this.clientsList = clients;
      this.filter();
    });
  }

  filter(event?) {
    this.filteredClients = this.filterPipe.transform(this.clientsList, this.searchInput, true);
  }

  selectClient(name) {
    this.modalCtrl.dismiss(name);
  }

  newClient() {
    this.modalCtrl.dismiss(this.searchInput);
  }

}
