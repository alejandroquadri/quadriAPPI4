import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ElasticDirective } from './directives';

import { WordFilterPipe } from './pipes/word-filter.pipe';
import { FieldFilterPipe } from './pipes/field-filter.pipe';
import { MomentPipe } from './pipes/moment.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ObjNgforPipe } from './pipes/objNgfor.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ElasticDirective,
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe,
    ObjNgforPipe
  ],
  exports: [
    ElasticDirective,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe,
    ObjNgforPipe
  ],
  providers: [
    WordFilterPipe,
    FieldFilterPipe,
    MomentPipe,
    SortPipe
  ]
})
export class SharedModule { }
