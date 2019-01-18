import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { EmailPspComponent } from '../../shared';

@Component({
  selector: 'app-psp-detail',
  templateUrl: './psp-detail.page.html',
  styleUrls: ['./psp-detail.page.scss'],
})
export class PspDetailPage implements OnInit {

  psp: any;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    }

  ngOnInit() {
    console.log(this.navParams.data);
    this.psp = this.navParams.data;
  }

  async sendPsp() {
    const modal = await this.modalCtrl.create({
      component: EmailPspComponent,
      componentProps: {'psp': this.psp}
    });
    modal.present();
    await modal.onDidDismiss()
    .then( data => {
      if (data === 'dismiss') { this.modalCtrl.dismiss(); }
    });
  }
}
