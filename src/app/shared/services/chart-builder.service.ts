import { Injectable } from '@angular/core';
import { StaticDataService } from './static-data.service';

@Injectable({
  providedIn: 'root'
})
export class ChartBuilderService {

  contentWidth: number;
  chartsData: any = {};

  constructor(
    private staticData: StaticDataService,
  ) { }

  buildDatasets(data: Array<any>, label?: string, yAxisID?: string) {
    const dataset = {
      label: label || null,
      yAxisID: yAxisID || null,
      fill: true,
      borderWidth: 1,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 1,
      pointRadius: 1,
      pointHitRadius: 10,
      data: data,
      spanGaps: false,
    };
    return dataset;
  }

  buildChartColor(color, backGroundColor) { {
      return {
        backgroundColor: backGroundColor,
        borderColor: color,
        pointBackgroundColor: backGroundColor,
        pointBorderColor: color,
        pointHoverBackgroundColor: backGroundColor,
        pointHoverBorderColor: color
      };
    }
  }

  buildChartColorDetail(
    backgroundColor,borderColor, pointBorderColor, pointBackgroundColor, pointHoverBackgroundColor, pointHoverBorderColor) { {
      return {
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        pointBackgroundColor: pointBackgroundColor,
        pointBorderColor: pointBorderColor,
        pointHoverBackgroundColor: pointHoverBackgroundColor,
        pointHoverBorderColor: pointHoverBorderColor
      };
    }
  }

   isFinished(log: any) {
    if (log.machine === 'Breton' ||
        log.machine === 'Lineal' ||
        log.machine === 'Pasado tablas' ||
        log.machine === 'Biseladora zocalos' ||
        log.machine === 'Desmolde' ||
        log.machine === 'Granalladora' ||
        log.machine === 'Biseladora') {
      return true;
    } else { return false; }
  }

  buildFilteredProdObj (filteredArray: Array<any>) {
    const filteredObj = {};

    filteredArray.forEach( log => {
      const prod = this.toSalesUnit(log.prod, log.dim);
      const seg = this.toSalesUnit(log.seg, log.dim);
      const broken = this.toSalesUnit(log.broken, log.dim);
      const rep = +this.toSalesUnit(log.rep, log.dim);
      if (!filteredObj[log.date]) {
        filteredObj[log.date] = {
          prod: prod,
          seg: seg + broken + rep
        };
      } else {
        filteredObj[log.date].prod += prod;
        filteredObj[log.date].seg += seg + broken + rep;
      }
    });
    return filteredObj;
  }

  toSalesUnit(unit: string, dim) {
    const eq = this.staticData.data.produccion.equivalences[dim];
    let total = 0;

    const itemN = +unit;
    total += itemN * eq.conv;

    return total;
  }
}
