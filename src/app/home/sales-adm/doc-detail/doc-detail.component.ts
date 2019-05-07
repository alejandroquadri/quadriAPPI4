import { SalesAdmHelperService } from './../sales-adm-helper.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SalesAdmService } from '../sales-adm.service';
import { PdfGeneratorService } from './../../../shared';
import * as moment from 'moment';


@Component({
  selector: 'app-doc-detail',
  templateUrl: './doc-detail.component.html',
  styleUrls: ['./doc-detail.component.scss']
})
export class DocDetailComponent implements OnInit {

  @Input() doc: any;
  @Input() printed: boolean;
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  logo = './assets/images/quadri.jpg';
  canvasLogo: any;
  afipObj: any;

  constructor(
    public modalCtrl: ModalController,
    private admData: SalesAdmService,
    private helper: SalesAdmHelperService,
    private pdfGen: PdfGeneratorService
  ) {
  }


  ngOnInit() {
    console.log(this.doc);
    this.convertLogoToBase64URL();
  }

  convertLogoToBase64URL(){
    const canvas = this.myCanvas.nativeElement;
    const img = new Image;
    const ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        this.canvasLogo = canvas.toDataURL('image/jpeg');
    };
    img.src = this.logo;
  }

  print() {
    if (this.printed) {
      this.createPdf(this.doc);
    } else {
      this.cae();
    }
  }

  // cae() {
  //   this.admData.nextNumberMock('A')
  //   .then( num => {
  //     return this.admData.afipMock(num);
  //   })
  //   .then( ret => {
  //     // console.log(ret);
  //     this.afipObj = ret;
  //     const obj = {...this.doc, ...this.afipObj};
  //     console.log(obj);
  //     this.createPdf(obj);
  //     this.admData.addPrintedList(obj.num);
  //     return this.savePrintedDoc(obj);
  //   })
  //   .then( ret => {
  //     console.log('guardado');
  //   });
  // }

  cae() {
    const numbody = this.helper.buildLastNumObj(this.doc);
    this.admData.getAfipNumber(numbody)
    .then( (num: any) => {
      // const ptoVta = ('0000' + num.PtoVta).slice(-4);
      // const nro = ('00000000' + num.CbteNro).slice(-8);
      // const caeNum = `${ptoVta}-${nro}`;
      // console.log(num);
      const afipObj = this.helper.buildInvoiceAfipObj(this.doc, num.CbteTipo, num.PtoVta, num.CbteNro);
      // console.log(afipObj);
      return this.admData.getAfipCae(afipObj);
    })
    // .then( (ret: any) => {
    //   console.log(ret);
    // });
    .then( (ret: any) => {
      // console.log(ret);
      const cabecera = ret['FeCabResp'];
      const detalle = ret['FeDetResp']['FECAEDetResponse'][0];
      const ptoVta = ('0000' + cabecera.PtoVta).slice(-4);
      const nro = ('00000000' + detalle['CbteDesde']).slice(-8);
      const caeNum = `${ptoVta}-${nro}`;
      this.afipObj = {
        cae: detalle['CAE'],
        caeFecha: moment(detalle['CAEFchVto']).format('YYYY-MM-DD'),
        caeNum: caeNum
      };
      const obj = {...this.doc, ...this.afipObj};
      console.log(obj);
      this.createPdf(obj);
      this.admData.addPrintedList(obj.num);
      return this.savePrintedDoc(obj);
    })
    .then( ret => {
      console.log('guardado');
    });
  }

  createPdf(doc) {
    const obj = this.pdfGen.genInvoicePdfObject(this.canvasLogo, doc);
    this.pdfGen.genPdf(obj);
  }

  savePrintedDoc(doc) {
    return this.admData.saveDoc(doc);
  }

}