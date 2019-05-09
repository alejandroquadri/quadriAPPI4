import { Component, OnInit } from '@angular/core';
import { SalesAdmService } from '../sales-adm.service';
import { WordFilterPipe, SortPipe } from '../../../shared';
import { ModalController } from '@ionic/angular';
import { DocDetailComponent } from '../doc-detail/doc-detail.component';

@Component({
  selector: 'app-printed-invoices',
  templateUrl: './printed-invoices.page.html',
  styleUrls: ['./printed-invoices.page.scss'],
})
export class PrintedInvoicesPage implements OnInit {

  docs$: any;
  docsCrude: any;
  docView: any;

  searchInput = '';
  field = 'date';
  asc = false;
  offset = 100;


  constructor(
    private admData: SalesAdmService,
    private searchFilter: WordFilterPipe,
    private sortPipe: SortPipe,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.docs$ = this.admData.getPrintedDocs()
    .subscribe( docs => {
      this.docsCrude = docs;
      console.log(this.docsCrude);
      this.filterSearchBar(this.docsCrude);
    });
  }

  filterSearchBar(event?) {
    const filtered = this.searchFilter.transform(this.docsCrude, this.searchInput, false);
    const sliced = this.sliceArray(filtered);
    this.docView = this.sortPipe.transform(sliced, this.field, this.asc, false);
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
      componentProps: {doc: form, printed: true}
    });
    return await profileModal.present();
  }

}
