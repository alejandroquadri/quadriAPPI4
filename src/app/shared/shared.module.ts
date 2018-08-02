import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElasticDirective } from './directives';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ElasticDirective
  ],
  exports: [
    ElasticDirective
  ]
})
export class SharedModule { }
