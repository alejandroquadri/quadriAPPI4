import { Component, OnInit } from '@angular/core';
import { CrmService, ClientFormComponent } from '../../shared';
import { StaticDataService, WordFilterPipe, SortPipe } from '../../../../shared';
import { ModalController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-client-log',
  templateUrl: './client-log.page.html',
  styleUrls: ['./client-log.page.scss'],
})
export class ClientLogPage implements OnInit {

  searchInput = '';
  periodArray = [];

  clientSubs: any;
  opsSubs: any;
  obsSubs: any;

  opObj: any;
  clientList: any;
  clientObj: any;
  clientViewCrude: any;
  filtered: any;
  clientView: any;
  totalsObj: any;

  salesReps: any;
  clientTypes: any;
  statusOptions: any;
  salesRep = '';
  clientType = '';
  status = 'Pendiente';

  sortTerm: string;
  sortDir = false;

  seeTotals = false;
  offset = 50;

  constructor(
    private crmData: CrmService,
    private staticData: StaticDataService,
    private filterPipe: WordFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController,
  ) {
    this.buildPeriodArray();
    this.clientTypes = this.staticData.data.crm.clientTypes;
    this.salesReps = this.staticData.data.crm.salesReps;
    this.statusOptions = this.staticData.data.crm.statusOptions;
  }

  ngOnInit() {
    this.clientSubs = this.crmData.getClients();
    this.opsSubs = this.crmData.getOpObject();

    this.obsSubs = combineLatest( this.clientSubs, this.opsSubs, (clients: any, ops: any) => ({clients, ops}))
    .subscribe( pair => {
      this.clientList = pair.clients;
      this.opObj = pair.ops;
      this.clientObj = this.buildClientObj();
      this.clientViewCrude = this.buildClientView(this.clientObj);
      this.filter();
    });
  }

  buildPeriodArray(months?: number) {
    // tslint:disable-next-line:no-unused-expression
    months ? '' : months = 6;
    const now = moment();

    this.periodArray.push('anterior');
    this.periodArray.push('indefinido');

    for (let i = 0; i < months; i++) {
      const month = now.clone().add(i, 'month').format('YYYY-MM');
      this.periodArray.push(month);
    }
    this.periodArray.push('posterior');
    this.periodArray.push('total');

    this.totalsObj = {};

    this.periodArray.forEach( period => {
      this.totalsObj[period] = 0;
    });
    console.log(this.periodArray);
  }

  buildClientObj() {
    // this.buildPeriodArray();
    this.sortTerm = this.periodArray[2]; // esto para que ordene segun el mes actual

    const clientObj = {};

    console.log('primer clientObj', clientObj);

    this.clientList.forEach( (client, index) => {
      const id = client.key;
      const clientVal = client.payload.val();

      if (!clientObj[id]) {
        clientObj[id] = {
          name: clientVal.name,
          salesRep: clientVal.salesRep || '',
          clientType: clientVal.clientType || ''
        };
        this.statusOptions.forEach( status => {
          clientObj[id][status] = {};
          this.periodArray.forEach( period => {
            clientObj[id][status][period] = 0;
          });
        });
      }
      if (clientVal.ops) {
        const opsList = Object.keys(clientVal.ops);
        opsList.forEach( op => {
          const month = this.monthTime(this.opObj[op].closeMonth);
          // console.log(id, op, this.opObj[op], month);
          console.log(clientObj[id], clientObj[id][this.opObj[op].status], this.opObj[op].status);
          clientObj[id][this.opObj[op].status][month] += this.opObj[op].total;
          clientObj[id][this.opObj[op].status]['total'] += this.opObj[op].total;
        });
      }
    });
    console.log(clientObj);
    return clientObj;
  }

  monthTime(month: string): string {

    if (month === 'indefinido') {
      return 'indefinido';
    } else {
      const anterior = moment(month).isBefore(this.periodArray[1], 'month');
      const posterior = moment(month).isAfter(this.periodArray[this.periodArray.length - 3], 'month');

      if (anterior) {
        return 'anterior';
      } else if (posterior) {
        return 'posterior';
      } else {
        return month;
      }
    }

  }

  buildClientView(clientObj: any) {
    const clientView = [];
    const clientKeys = Object.keys(clientObj);

    clientKeys.forEach( client => {
      const clientItem = clientObj[client];
      clientItem['key'] = client;
      clientView.push(clientItem);
    });
    // console.log(clientView);
    return clientView;
  }

  monthFormat(month) {
    if (month === 'anterior' || month === 'indefinido' || month === 'posterior' || month === 'total') {
      return month;
    } else {
      return moment(month).format('MMM YY');
    }
  }

  filter() {
    const fieldsFiltered = this.fieldFilter(this.clientViewCrude);
    this.filtered = this.filterPipe.transform(fieldsFiltered, this.searchInput, false);
    // const sorted = this.sort(lastFilter);
    // this.clientView = this.sliceArray(sorted);
    this.sort();
    // this.calcTotal();
  }

  searchBar(event) {
    this.searchInput = event;
    this.filter();
  }

  fieldFilter(array: Array<any>) {
    return array.filter( client => {
      return ( this.clientTypeFilter(client) && this.salesRepFilter(client));
    });
  }

  clientTypeFilter(client) {
    if (this.clientType === '') {
      return true;
    } else {
      return ( client.clientType === this.clientType);
    }
  }

  salesRepFilter(client) {
    if (this.salesRep === '') {
      return true;
    } else {
      let salesRep;
      this.salesRep === 'Tarruella Alberto Horacio' ? salesRep = 'Tarruella Alberto Horacio ' : salesRep = this.salesRep;
      return ( client.salesRep === salesRep);
    }
  }

  sort() {
    let ordered;
    if (this.sortTerm === 'client') {
      ordered = this.sortPipe.transform(this.filtered, 'name', this.sortDir, false);
    } else {
      ordered = this.filtered.sort((a: any, b: any) => {
        if (this.sortDir) {
          if (a[this.status][this.sortTerm] < b[this.status][this.sortTerm]) {
            return -1;
          } else if (a[this.status][this.sortTerm] > b[this.status][this.sortTerm]) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (a[this.status][this.sortTerm] > b[this.status][this.sortTerm]) {
            return -1;
          } else if (a[this.status][this.sortTerm] < b[this.status][this.sortTerm]) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }
    this.clientView = this.sliceArray(ordered);
    this.calcTotal();
  }

  changeSort(term) {
    this.sortTerm = term;
    this.sortDir = !this.sortDir;
    this.sort();
  }

  calcTotal() {
    this.totalsObj = {};

    this.periodArray.forEach( period => {
      this.totalsObj[period] = 0;
    });

    this.clientView.forEach( client => {
      this.statusOptions.forEach( status => {
        if (status === this.status) {
          this.periodArray.forEach( period => {
            this.totalsObj[period] += client[status][period];
          });
        }
      });
    });
    // console.log(this.totalsObj);
  }

  async seeClient (key: string) {
    const modal = await this.modalCtrl.create({
      component: ClientFormComponent,
      componentProps: {$key: key, mode: 'edit'}
    });
    return modal.present();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(event) {
    setTimeout( () => {
      event.target.complete();

      // aca es donde hay que poner la logica para que cargue mas datos
      this.offset += 20;
      this.filter();

      // esto es para que si ya tiene todos los registros no siga buscando
      // if (this.avionView.length === this.filtered.length ) {
      //   console.log('llego');
      //   event.target.disabled = true;
      // }

    }, 500);
  }

}
