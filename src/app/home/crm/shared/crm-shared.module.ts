import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import { AddOpPage } from './add-op/add-op.page';
import { ClientSelectPage } from './client-select/client-select.page';
import { OpSelectPage } from './op-select/op-select.page';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AddOpPage,
    ClientSelectPage,
    OpSelectPage
  ],
  entryComponents: [
    ClientSelectPage,
    OpSelectPage
  ],
  exports: [
    AddOpPage,
    ClientSelectPage,
    OpSelectPage
  ]
})
export class CrmSharedCModule { }
