import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';

import { ProductionService, StaticDataService, ChartBuilderService } from '../../services';


@Component({
  selector: 'app-ac-prod',
  templateUrl: './ac-prod.component.html',
  styleUrls: ['./ac-prod.component.scss']
})
export class AcProdComponent implements OnInit {

  prod$: any;
  production: Array<any>;
  acChart: any;
  staticData: any;
  equivalences: any;

  date = moment();
  prodMonthObj = 8000;
  unit = 'm2';
  rangeDate = {lower: 33, upper: 60};

  labels: Array<any> = [];
  datasets: Array<any> = [];
  colors: Array<any> = [];
  options: any;
  lineChartLegend = true;
  lineChartType = 'line';
  showChart = false;

  constructor(
    private chartBuilder: ChartBuilderService,
    private prodData: ProductionService,
    private staticDataP: StaticDataService,
    public number: DecimalPipe
  ) { }

  ngOnInit() {
    this.prod$ = this.prodData.getProduction().subscribe( (prod: Array<any>) => {
      this.staticData = this.staticDataP.data.produccion;
      this.production = prod;
      this.acProdData();
    });
  }

  acProdData() {
    this.labels.length = 0;
    const finishedProd: Array<any> = [];
    const second: Array<any> = [];
    const objLine: Array<any> = [];
    const month = `${this.date.format('M')}-${this.date.format('Y')}`;
    const monthsDays = this.date.daysInMonth();
    const dailyProdObj = this.prodMonthObj / monthsDays;

    const filtered = this.production.filter( log => {
      const date = `${moment(log.date).format('M')}-${moment(log.date).format('Y')}`;
      // return (moment(log.date).format('M') === month &&
      return (date === month &&
      this.chartBuilder.isFinished(log) &&
        this.staticData.equivalences[log.dim].unit === this.unit);
    });

    const filteredObj = this.chartBuilder.buildFilteredProdObj(filtered);

    let totalProd = 0;
    let totalseg = 0;
    let totalObj = 0;

    for (let i = 1 ; i <= monthsDays ; i++) {
      const date = this.date.date(i).format('YYYY-MM-DD'); // asigno a la fecha
      this.labels.push(i);
      if (filteredObj[date]) {
        totalProd += filteredObj[date].prod;
        totalseg += filteredObj[date].seg;
      }
      totalObj += dailyProdObj;
      finishedProd.push(totalProd);
      second.push(totalseg);
      objLine.push(totalObj);
    }

    this.datasets = [
      this.chartBuilder.buildDatasets(finishedProd, 'produccion', 'A'),
      this.chartBuilder.buildDatasets(second, 'segunda', 'A'),
      this.chartBuilder.buildDatasets(objLine , 'objetivo', 'A')
    ];
    this.options = this.chartOptions();
    this.colors = [
      this.chartBuilder.buildChartColor('rgba(0, 128, 0, 1)', 'rgba(0, 128, 0, 0.2)'),
      this.chartBuilder.buildChartColor('rgba(220, 57, 18, 1)', 'rgba(220, 57, 18, 0.2)'),
      this.chartBuilder.buildChartColor('rgba(51, 102, 204, 1)', 'rgba(51, 102, 204, 0.2)'),
    ];

    this.showChart = true;
  }

  chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
      },
      scales: {
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'produccion',
            },
            ticks: {
              // max: 10,
              // min: 0,
              stepSize: 1000,
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

  formatTooltip(value, format: string) { // .yLabel
    return this.number.transform(value.yLabel, format);
  }

  addMonth() {
    this.date = moment(this.date).add(1, 'months');
    this.acProdData();
  }

  subMonth() {
    this.date = moment(this.date).subtract(1, 'months');
    this.acProdData();
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }



}
