import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { map } from 'rxjs/operators';

import { SalesAdmService } from '../sales-adm.service';
import { SalesAdmHelperService } from '../sales-adm-helper.service';
import { WordFilterPipe } from '../../../shared';
import { DocDetailComponent } from '../doc-detail/doc-detail.component';

@Component({
  selector: 'app-to-print-invoices',
  templateUrl: './to-print-invoices.page.html',
  styleUrls: ['./to-print-invoices.page.scss'],
})
export class ToPrintInvoicesPage implements OnInit {

  docs$: any;
  docObj: any;
  arrayAll: any;
  docView: any;

  searchInput = '' ;
  sortTerm = 'date';
  sortDir = true;
  offset = 100;

  constructor(
    private admData: SalesAdmService,
    private helper: SalesAdmHelperService,
    private searchFilter: WordFilterPipe,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.subscribe();
  }

  subscribe() {
    this.docs$ = this.admData.getPendingInvoices()
    .pipe(
      map( (res: any) => res.json())
    )
    .subscribe( docs => {
      this.docObj = this.helper.buildCalipsoObj(docs.data);
      this.arrayAll = this.helper.buildArray(this.docObj);
      this.filterSearchBar();
      console.log(this.docObj);
    });
  }

  filterSearchBar(event?) {
    // this.viewArray = this.searchFilter.transform(this.filteredPsp,this.searchInput, false);
    this.docView = this.sliceArray(this.searchFilter.transform(this.arrayAll, this.searchInput, false));
    // this.sort();
  }

  sliceArray(array: Array<any>) {
    return array.slice(0, this.offset);
  }

  doInfinite(event) {
    setTimeout( () => {
      event.target.complete();

      // aca es donde hay que poner la logica para que cargue mas datos
      this.offset += 20;
      this.filterSearchBar();

    }, 500);
  }

  async seeDoc(form?: any) {
    const profileModal = await this.modalCtrl.create({
      component: DocDetailComponent,
      componentProps: form
    });
    return await profileModal.present();
  }



}
