import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SalesAdmService } from '../sales-adm.service';

@Component({
  selector: 'app-doc-detail',
  templateUrl: './doc-detail.component.html',
  styleUrls: ['./doc-detail.component.scss']
})
export class DocDetailComponent implements OnInit {

  @Input() doc: any;

  constructor(
    public modalCtrl: ModalController,
    private admData: SalesAdmService
  ) { }

  ngOnInit() {
    console.log(this.doc);
  }

  print() {
    this.admData.afipMock()
    .then( ret => {
      console.log(ret);
    });
  }

}
