import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs; 

import * as moment from 'moment';
import { headerSize } from 'tar';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor(
    private number: DecimalPipe
  ) { }

  genPdf(obj: any): void {
    pdfMake.createPdf(obj).open();
  }

  genInvoicePdfObject(logo: string, data: any, afip: any) {

    const articles = this.buildArtArray(data.items);

    const dd = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [40, 190, 40, 170],
      styles: {
        header: {
          fontSize: 9
        },
        tableArt: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
        },
        tableArtHeading: {
          fillColor: '#eeeeee',
          alignment: 'center',
          margin: [0, 5, 0, 5]
        },
        footerCae: {
          margin: [5, 20, 0, 0],
          fontSize: 9
        }
      },
      header: [
        {
          margin: [40, 20, 40, 0],
          table: {
            widths: ['*', 50, '*'],
            body: [
              [
                {
                  text: 'ORIGINAL',
                  colSpan: 3,
                  alignment: 'center',
                  border: [false, false, false, false]
                }, {}, {}
              ],
              [
                {
                  image: logo,
                  width: 150,
                  border: [false, false, false, true]
                },
                {
                  border: [false, false, false, true],
                  table: {
                    body: [
                      [
                        {
                          text: `${data.pos_IVA}`,
                          border: [false, false, false, false],
                          margin: [ 5, 5, 5, 5],
                          alignment: 'center',
                          fillColor: '#eeeeee',
                          fontSize: 20,
                        }
                      ]
                    ]
                  },
                margin: [ 8, 10, 5, 5]
                },
                {
                  margin: [ 40, 0, 0, 10],
                  border: [false, false, false, true],
                  style: 'header',
                  text: [
                    {text: `${this.docType(data.tipo_doc)} `, fontSize: 15},
                    {text: `${afip.num}\n`, fontSize: 15},
                    {text: `Fecha emision ${moment(data.date).format('DD-MM-YYYY')}\n\n`, fontSize: 12},
                    {text: 'Eugenio P. Quadri y CIA SACIFIA\nGascon 483, CABA\nIVA Responsable Inscripto'},
                    {text: '\nCUIT: 30-50245565-2\nIngresos Brutos: 901-981895-0\nInicio de actividades: 14/11/1960'}
                  ]
                }
              ]
            ]
          }
        }
          ],
    content: [
      {
        text: `Cliente:  ${data.razSoc}`, margin: [0, 10, 0, 4]
      },
      {
        text: `CUIT:  ${data.cuit}`, margin: [0, 0, 0, 4]
      },
      {
        text: `Domicilio:  ${data.calle}, ${data.ciudad}`, margin: [0, 0, 0, 4]
      },
      {
        text: `Condicion frente al IVA:  ${this.condIva(data.pos_IVA)}`, margin: [0, 0, 0, 4]
      },
      {
        text: 'Condicion de venta:  7 dias fecha de factura', margin: [0, 0, 0, 4]
      },
      {
        text: `Fecha vencimiento:  ${moment(data.date).add(7, 'd').format('DD/MM/YYYY')}`,
        margin: [0, 0, 0, 4]
      },
      {
        text: `${data.detalle}`,
        margin: [0, 0, 0, 20]
      },
      {
        style: 'tableArt',
        table: {
          widths: [100, '*', 50, 50, 50, 50],
          body: articles
        }
      }
        ],
    footer: [
      {
        margin: [40, 0, 40, 5],
        table: {
          widths: [ '*', 150, 80],
          body: [
            [
              {text: '', border: [false, true, false, false]}, 
              {text: 'Neto\nIVA\nP. IIBB\nTotal', alignment: 'right', border: [false, true, false, false], margin: [0, 5, 0, 5]}, 
              {
                text: `${this.number.transform(data.total, '1.0-2')}
                ${this.number.transform(data.ivaTotal, '1.0-2')}
                ${this.number.transform(data.iibb, '1.0-2')}
                ${this.number.transform(data.totalFinal, '1.0-2')}`,
                border: [false, true, false, false],
                margin: [0, 5, 0, 5]
              }
            ],
            [
              {text: '', border: [false, true, false, false]}, 
              {
                text: 'CAE\nFecha vencimiento CAE',
                alignment: 'right',
                border: [false, true, false, false],
                style: 'footerCae'
              },
              {
                text: `${afip.cae}\n${moment(afip.caeFecha).format('DD/MM/YYYY')}`,
                alignment: 'left',
                border: [false, true, false, false],
                style: 'footerCae'
              }
            ]
          ]
        }
      }
    ]
    };
    return dd;
  }

  buildArtArray(data: Array<any>) {
    const arrayArt = [
      [
        {text: 'Codigo', style: 'tableArtHeading', border: [false, false, false, true]},
        {text: 'Descripcion', style: 'tableArtHeading', border: [false, false, false, true]},
        {text: 'Cantidad', style: 'tableArtHeading', border: [false, false, false, true]},
        {text: 'Unidad', style: 'tableArtHeading', border: [false, false, false, true]},
        {text: 'Precio', style: 'tableArtHeading', border: [false, false, false, true]},
        {text: 'Total', style: 'tableArtHeading', border: [false, false, false, true]}
      ]
    ];

    data.forEach( art => {
      let item = [
        {
          text: art.codigocc,
          style: 'tableArt',
          border: [false, false, false, false]
        },
        {
          text: art.conceptocomercial,
          style: 'tableArt',
          border: [false, false, false, false]
        },
        {
          text: this.number.transform(art.cantidad, '1.0-2'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center'
        },
        {
          text: art.unidad,
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'center'
        },
        {
          text: this.number.transform(art.precio_descuento, '1.2-2'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'right'
        },
        {
          text: this.number.transform(art.total_importe, '1.2-2'),
          style: 'tableArt',
          border: [false, false, false, false],
          alignment: 'right'
        }
      ];
      arrayArt.push(item);
    });

    return arrayArt;

  }

  docType(doc) {
    let docType;
    switch (doc) {
      case 'Factura de Venta':
        docType = 'Factura';
        break;

      case 'Factura de Venta Mostrador':
        docType = 'Factura';
        break;

      case 'Nota de Débito de Venta':
        docType = 'Nota de Débito';
        break;

      case 'Nota de Crédito de Venta':
        docType = 'Nota de Crédito';
        break;

      default:
        break;
    }
    return docType;
  }

  condIva(letra: string) {
    if (letra === 'A') {
      return 'Responsable inscripto';
    } else {
      return 'Consumidor final';
    }
  }
}

// playground requires you to assign document definition to a variable called dd

// var dd = {
//   pageSize: 'A4',
//   pageOrientation: 'portrait',
//   pageMargins: [40, 180, 40, 170],
//   styles: {
//       header: {
//         fontSize: 9
//       },
//   tableArt: {
//     margin: [0, 5, 0, 5],
//     fontSize: 10
//   },
//   tableArtHeading: {
//       fillColor: '#eeeeee',
//       margin: [0, 5, 0, 5]
//   }
// },
//   header: [
//       {
//           margin: [40, 20, 40, 0],
//           table: {
//               widths: ["*",50, "*"],
//               // heights: [20, 130],4
//               body: [
//                   [
//                       {
//                           text: 'ORIGINAL',
//                           colSpan: 3,
//                           alignment: 'center',
//                           border: [false, false, false, false]
//                       },{},{}
//                   ],
//                   [
//                       {
//                     image: 'sampleImage.jpg',
//                     width: 130,
//                     border: [false, false, false, true]
//                     },
//                       {
//                   border: [false, false, false, true],
//                   table: {
//                               body: [
//                         [
//                             {   
//                                 text: 'B',
//                                 border: [false, false, false, false],
//                                 margin: [ 5, 5, 5, 5],
//                                 alignment: 'center',
//                                 fillColor: '#eeeeee',
//                                   fontSize: 20,
//                             }
//                         ]
//                       ]
//                     },
//                     margin: [ 8, 10, 5, 5]
//                 },
//                       {   
//                           margin: [ 40, 0, 0, 10],
//                           border: [false, false, false, true],
//                           style: 'header',
//                           text: [
//                       {text: 'Factura   ', fontSize: 16},
//                       {text: '0009-000001\n\n', fontSize: 16},
//                             {text:'Eugenio P. Quadri y CIA SACIFIA\nGascon 483, CABA\nIVA Responsable Inscripto'}, 
//                             {text:'\nCUIT: 30-50245565-2\nIngresos Brutos: 901-981895-0\nInicio de actividades: 14/11/1960'}
//                          ] 
//                       }  
//                   ]
//               ]
//           }
//       }
//       ],
// content: [
//   // 	  { 
//   // 	      margin: [0, 20, 0, 20],
//   // 	      text: [
//   //             	    {
//   //                       text: "Cliente: Pepe\n",
//   //                     },
//   //                     {
//   //                       text: "CUIT: 20302179833\n"
//   //                     },
//   //                     {
//   //                       text: "Domicilio: Robert Kennedy 2281\n"
//   //                     },
//   //                     {
//   //                       text: "Condicion de IVA: Consumidor Final\n"
//   //                     },
//   //                     {
//   //                           text: "Condicion de venta: Contado anticipado\n"
//   //                       }
//   // 	        ]
//   // 	  },
//       {
//           text:'hola'
//       },
//       {
//           text:'hola'
//       },
//       {
//         style: 'tableArt',
//         table: {
//           widths: [100, "*", 50, 50, 40, 40],
//           body: [
//                 [
//                     {text: 'Codigo', style: 'tableArtHeading', border: [false, false, false, false]},
//                     {text: 'Descripcion', style: 'tableArtHeading', border: [false, false, false, false]},
//                     {text: 'Cantidad', style: 'tableArtHeading', border: [false, false, false, false]}, 
//                     {text: 'Unidad', style: 'tableArtHeading', border: [false, false, false, false]},
//                     {text: 'Precio', style: 'tableArtHeading', border: [false, false, false, false]},
//                     {text: 'Total', style: 'tableArtHeading', border: [false, false, false, false]}
//                 ],
//                 [
//                     {text: '83ADRP32404', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '64 panes Brechiato 40 x 40', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '100', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: 'm2', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '$ 100', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '100.00', style: 'tableArt', border: [false, false, false, false]}
//                 ],
//                 [
//                     {text: '83ADRP32404', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '64 panes Brechiato 40 x 40', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '100', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: 'm2', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '$ 100', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '100.00', style: 'tableArt', border: [false, false, false, false]}
//                 ],
//                 [
//                     {text: '83ADRP32404', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '64 panes Brechiato 40 x 40', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: '100', style: 'tableArt', border: [false, false, false, false]}, 
//                     {text: 'm2', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '$ 100', style: 'tableArt', border: [false, false, false, false]},
//                     {text: '100.00', style: 'tableArt', border: [false, false, false, false], }
//                 ]
//           ]
//         }
//       }
        
//     ],
//     footer: [
//         {
//             margin: [40, 0, 40, 5],
//             table: {
//               widths: [ "*", 150, 150],
//               body: [
//                       [   {text: '', border: [false, true, false, false]}, 
//                           {text: 'Neto\nIVA\nP. IIBB\nTotal', alignment: 'right', border: [false, true, false, false]}, 
//                           {text: '300\n63\n12\n375', border: [false, true, false, false]}
//                       ],
//                       [
//                           {text: '', border: [false, true, false, false]}, 
//                           {text: 'CAE\nFecha vencimiento CAE', alignment: 'right', border: [false, true, false, false], margin: [5, 20, 0, 0]}, 
//                           {text: '69162063914244\n28/04/2019', alignment: 'left', border: [false, true, false, false], margin: [5, 20, 0, 0]}
//                       ]
//                   ]
//             }
//         }
        
//       ]

// }
