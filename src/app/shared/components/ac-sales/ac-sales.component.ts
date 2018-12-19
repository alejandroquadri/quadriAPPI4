import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { SalesService, FinanceService, StaticDataService, ChartBuilderService } from '../../services';
import { LoggerService } from '../../../auth/shared/logger.service';

@Component({
  selector: 'app-ac-sales',
  templateUrl: './ac-sales.component.html',
  styleUrls: ['./ac-sales.component.scss']
})
export class AcSalesComponent implements OnInit {

  objectives$: any;
  sales$: any;
  fin$: any;
  obs$: any;
  date = moment();

  sales: any;
  avionList: any;

  eq: any;
  obj: any;
  brand = '';
  salesMan = '';
  showAvion = false;

  totalSales = 0;
  toCom = 0;

  labels: Array<any> = [];
  datasets: Array<any> = [];
  colors: Array<any> = [];
  options: any;
  lineChartLegend = true;
  lineChartType = 'line';
  showChart = false;

  constructor(
    private salesData: SalesService,
    private financeData: FinanceService,
    private staticData: StaticDataService,
    private chartBuilder: ChartBuilderService,
    private authData: LoggerService,
    public number: DecimalPipe
  ) { }

  ngOnInit() {
    const today = moment();
    const end = today.format('YYYYMMDD');
    const start = today.date(1).subtract(6, 'months').format('YYYYMMDD');

    this.objectives$ = this.salesData.getObjectives();
    this.sales$ = this.salesData.getRevenue(start, end)
    .pipe( map( res => res.json()));
    this.fin$ = this.financeData.getAvionList();

    this.obs$ = combineLatest(
      this.sales$,
      this.objectives$,
      this.fin$,
      (sales: any, objectives: any, avion: any) => ({sales, objectives, avion})
    )
    .subscribe( pair => {
      this.eq = this.staticData.data.crm.objectives.precio * this.staticData.data.crm.objectives.qEq;
      this.obj = this.staticData.data.crm.objectives.precio * this.staticData.data.crm.objectives.qObj;
      this.sales = pair.sales.data;
      this.avionList = pair.avion;
      this.salesDataFilter();
    });
  }

  salesDataFilter() {
    if (this.sales) {
      this.showChart = false;
      this.labels.length = 0;
      const finishedSales: Array<any> = [];
      const finishedQuantity: Array<any> = [];
      const objLine: Array<any> = [];
      const eqLine: Array<any> = [];
      const month = this.date.format('MM/YY');
      const monthDays = this.date.daysInMonth();
      let eq = this.eq;
      let salesObj = this.obj;

      if (this.salesMan !== '') {
        eq = eq / 2;
        salesObj = salesObj / 2;
      }

      const dailyEqSales = eq / monthDays;
      const dailyObjSales = salesObj / monthDays;
      let totalSales = 0;
      let totalQuantity = 0;
      let totalObjSales = 0;
      let totalEqSales = 0;

      const salesFiltered = this.sales.filter( sale => {
        const momentDate = moment(sale.fecha).format('MM/YY');
        return (momentDate === month &&
          sale.transaccion !== 'Nota de Debito' &&
          this.salesManFilter(sale.vendedor) &&
          this.brandFilter(sale.marca)
        );
      });

      const avionFiltered = this.avionList.filter( avion => {
        return avion.payload.val().type === 'Ingreso';
      });

      const obj = this.buildSalesObj(salesFiltered);
      const avionObj = this.buildAvionObj(avionFiltered);
      for (let i = 1, n = monthDays ; i <= n; i++) {
        const date = this.date.date(i).format('YYYY-MM-DD');
        this.labels.push(i);
        if (obj[date]) {
          totalSales += obj[date].total;
          totalQuantity += obj[date].quantity;
        }
        if (this.showAvion) {
          if (avionObj[date]) {
            totalSales += avionObj[date].total;
          }
        }
        totalObjSales += dailyObjSales;
        totalEqSales += dailyEqSales;
        finishedQuantity.push(totalQuantity);
        finishedSales.push(totalSales);
        objLine.push(totalObjSales);
        eqLine.push(totalEqSales);
      }

      this.totalSales = finishedSales[finishedSales.length - 1];
      this.eq / 2 - this.totalSales > 0 ? this.toCom = this.eq / 2 - this.totalSales : this.toCom = 0 ;

      this.datasets = [
        this.chartBuilder.buildDatasets(finishedSales, 'ventas', 'A'),
        this.chartBuilder.buildDatasets(eqLine, 'equilibrio', 'A'),
        this.chartBuilder.buildDatasets(objLine , 'objetivo', 'A'),
        this.chartBuilder.buildDatasets(finishedQuantity , 'cantidad', 'B')
      ];

      this.options = this.chartOptions();
      this.colors = [
        this.chartBuilder.buildChartColor('rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'),
        this.chartBuilder.buildChartColor('rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)'),
        this.chartBuilder.buildChartColor('rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)'),
        this.chartBuilder.buildChartColor('rgba(255, 153, 0, 1)', 'rgba(255, 153, 0, 0.2)')
      ];
      this.showChart = true;
    }

  }

  salesManFilter(salesMan) {
    let result;
    switch (this.salesMan) {
      case 'Alejandra Roldan':
        if (salesMan === 'Alejandra Roldan') {
          result = true;
        } else {
          result = false;
        }
      break;
      case 'Alberto Tarruella':
        if (salesMan === 'Tarruella Alberto Horacio ') {
          result = true;
        } else {
          result = false;
        }
      break;
      default:
        result = true;
        break;
    }
    return result;
  }

  brandFilter(brand: string) {
    let result;
    switch (this.brand) {
      case 'Quadri':
        if (brand === 'Quadri - Quadri') {
          result = true;
        } else {
          result = false;
        }
      break;
      default:
        result = true;
        break;
    }
    return result;
  }

  buildSalesObj(filteredArray: Array<any>, monthly?: boolean) {
    const filteredObj = {};
    console.log(filteredArray);
    filteredArray.forEach( sale => {
      const total = Number(sale.total)
      let cant = Number(sale.cantidad);
      sale.transaccion === 'Nota de Credito' ? cant = -cant : cant = cant;
      let quantity;
      let date;

      if (sale.unidad_medida === 'M2') {
        quantity = cant;
      } else {
        quantity = 0;
      }
      console.log(sale.transaccion, quantity, total);

      if (monthly) {
        date = moment(sale.fecha).format('YYYY-MM');
      } else {
        date = moment(sale.fecha).format('YYYY-MM-DD');
      }
      if (!filteredObj[date]) {
        filteredObj[date] = {
          total: total,
          quantity: quantity
        };
      } else {
        filteredObj[date].total += total;
        filteredObj[date].quantity += quantity;
      }
    });
    return filteredObj;
  }

  buildAvionObj(filteredArray: Array<any>, monthly?: boolean) {
    const filteredObj = {};

    filteredArray.forEach( saleObj => {
      const sale = saleObj.payload.val();
      const total = + sale.amount;
      let date;

      if (monthly) {
        date = moment(sale.date).format('YYYY-MM');
      } else {
        date = moment(sale.date).format('YYYY-MM-DD');
      }
      if (!filteredObj[date]) {
        filteredObj[date] = {
          total: total,
        };
      } else {
        filteredObj[date].total += total;
      }
    });

    return filteredObj;
  }

  chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'facturacion',
            },
            ticks: {
              // max: 10,
              // min: 0,
              stepSize: 200000,
              // callback: (value, index, values) => this.formatNumber(value, '1.0', 'money')
              callback: (value, index, values) => ''
            },
            id: 'A',
            type: 'linear',
            position: 'left'
          },
          {
            display: false,
            scaleLabel: {
              display: true,
              labelString: 'm2',
            },
            ticks: {
              // callback: (value, index, values) => this.formatNumber(value, '1.0', 'm2')
              callback: (value, index, values) => ''
            },
            id: 'B',
            type: 'linear',
            position: 'right'
          }
        ],
        xAxes: [
          {
            ticks: {
              // callback: (value, index, values) => this.formatNumber(value, '1.0', 'm2')
              callback: (value, index, values) => ''
            },
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => this.formatTooltip(tooltipItem, '1.0-0')
        }
      }
    };
  }

  formatNumber(value, format: string) {
    let val;
    if (format === 'money') {
      val = `$ ${this.number.transform(value, format)}`;
    } else if (format === 'm2' ) {
      val = `${this.number.transform(value, format)} m2`;
    }
    return val;
  }

  formatTooltip(value, format: string) { // .yLabel
    let val;
    if (value.datasetIndex === 1 ||
        value.datasetIndex === 2 ||
        value.datasetIndex === 0 ) {
      val = `$ ${this.number.transform(value.yLabel, format)}`;
    } else if (value.datasetIndex === 3) {
      val = `${this.number.transform(value.yLabel, format)} m2`;
    }
    return val;
  }

  see (obj) {
    console.log(obj);
  }

  permission(area: string) {
    return this.authData.checkRestriction(area);
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months');
    this.salesDataFilter();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months');
    this.salesDataFilter();
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

}
