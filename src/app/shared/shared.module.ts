import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ElasticDirective } from './directives';
import { ChartsModule } from 'ng2-charts';

import { WordFilterPipe } from './pipes/word-filter.pipe';
import { FieldFilterPipe } from './pipes/field-filter.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ObjNgforPipe } from './pipes/objNgfor.pipe';

import { AcSalesComponent } from './components';
import { AcProdComponent } from './components/ac-prod/ac-prod.component';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  declarations: [
    ElasticDirective,
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe,
    ObjNgforPipe,
    AcSalesComponent,
    AcProdComponent,
    CustomCurrencyPipe
  ],
  exports: [
    ElasticDirective,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe,
    ObjNgforPipe,
    CustomCurrencyPipe,
    AcSalesComponent,
    AcProdComponent
  ],
  providers: [
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe,
    DecimalPipe,
    CustomCurrencyPipe
  ]
})
export class SharedModule { }
