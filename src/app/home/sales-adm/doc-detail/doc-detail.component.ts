import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SalesAdmService } from '../sales-adm.service';
import { PdfGeneratorService } from './../../../shared';

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

  cae() {
    this.admData.nextNumber('A')
    .then( num => {
      return this.admData.afipMock(num);
    })
    .then( ret => {
      // console.log(ret);
      this.afipObj = ret;
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