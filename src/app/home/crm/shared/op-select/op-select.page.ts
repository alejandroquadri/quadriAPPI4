import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { CrmService } from '../crm.service';

@Component({
  selector: 'app-op-select',
  templateUrl: './op-select.page.html',
  styleUrls: ['./op-select.page.scss'],
})
export class OpSelectPage implements OnInit {

  searchInput = '';
  opSubs: any;
  opList: Array<any>;
  filteredOps;
  newOpAdd = true;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private crmData: CrmService) { }

  ngOnInit() {
    this.opSubs = this.crmData.getOpsList();
    this.opSubs.subscribe( ops => {
      this.opList = this.initialFilter(ops);
      this.filter();
    });
  }

  initialFilter(opList) {
    // permito que se vean solo las ops que aun estan pendientes
    return opList.filter((op: any) => {
      return (
        op.payload.val().status === 'Pendiente' ||
        op.payload.val().status === 'Seguro');
    });
  }

  filter (event?) {
    // filtro que sirve para la searchbar
    if (this.searchInput !== '') {
      this.filteredOps = this.opList.filter((op: any) => {
        return (op.payload.val().obra.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
      });
    } else {
      this.filteredOps = this.opList;
    }
  }

  selectOp (op, key) {
    this.modalCtrl.dismiss( {op: op, key: key} );
  }

  newOp() {
    this.modalCtrl.dismiss(this.searchInput);
  }

}
