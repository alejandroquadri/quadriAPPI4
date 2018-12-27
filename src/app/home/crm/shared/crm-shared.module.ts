import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared';
import { AddOpPage } from './add-op/add-op.page';
import { ClientSelectPage } from './client-select/client-select.page';
import { OpSelectPage } from './op-select/op-select.page';
import { EmailPspComponent } from './email-psp/email-psp.component';
import { ClientFormComponent } from './client-form/client-form.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AddOpPage,
    ClientSelectPage,
    OpSelectPage,
    EmailPspComponent,
    ClientFormComponent
  ],
  entryComponents: [
    ClientSelectPage,
    OpSelectPage
  ],
  exports: [
    AddOpPage,
    ClientSelectPage,
    OpSelectPage,
    EmailPspComponent,
    ClientFormComponent
  ]
})
export class CrmSharedModule { }
