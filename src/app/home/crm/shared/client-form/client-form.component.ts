import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { combineLatest } from 'rxjs';

import { CrmService } from '../crm.service';
import { StaticDataService } from '../../../../shared';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  clientKey: string;
  mode: string;
  editForm = false;
  editContactKey: string;
  salesRep: string;
  clientType: string;
  salesReps: any;
  clientTypes: any;
  clientName: any;

  clientForm: FormGroup;

  client$: any;
  contact$: any;
  combined$: any;
  clientObj: any;
  contactObj: any;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private crmData: CrmService,
    private staticData: StaticDataService,
    private fb: FormBuilder,
  ) {
    this.clientKey = this.navParams.data.$key;
    this.mode = this.navParams.data.mode;
    this.salesReps = this.staticData.data.crm.salesReps;
    this.clientTypes = this.staticData.data.crm.clientTypes;
    this.buildForm();
  }

  ngOnInit() {
    this.client$ = this.crmData.getClient(this.clientKey);
    this.contact$ = this.crmData.getContactObj();

    this.combined$ = combineLatest(this.client$, this.contact$, (client: any, contacts: any) => ({client, contacts}))
    .subscribe( pair => {
      this.clientObj = pair.client;
      this.salesRep = this.clientObj.salesRep;
      this.clientType = this.clientObj.clientType;
      this.contactObj = pair.contacts;
      this.clientName = this.clientObj.name;
    });
  }

  buildForm() {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      tel: [''],
      mail: [''],
      pos: [''],
      obs: ['']
    });
  }

  change(field: string, value: string) {
    // tslint:disable-next-line:no-unused-expression
    value === 'Tarruella Alberto Horacio' ? value = 'Tarruella Alberto Horacio ' : '';
    const form = {};
    form[field] = value;
    this.crmData.updateClient(this.clientKey, form)
    .then( () => console.log(`${field} actualizado`));
  }

  submit() {
    if (!this.editForm) {
      this.newContact();
    } else {
      this.editContact();
    }
  }

  newContact() {
    const form = this.clientForm.value;
    form['clientKey'] = this.clientKey;
    this.crmData.newContact(form).then( _ => {
      this.clientForm.reset();
    });
  }

  switchEditContact(contact, contactKey) {
    this.clientForm.patchValue( {
      name: contact.name,
      tel: contact.tel,
      mail: contact.mail,
      pos: contact.pos,
      obs: contact.obs
    });
    this.editForm = true;
    this.editContactKey = contactKey;
  }

  switchToNew() {
    this.editForm = false;
    this.editContactKey = undefined;
    this.clientForm.reset();
  }

  editContact() {
    this.crmData.updateContact(this.editContactKey, this.clientForm.value)
    .then( _ => console.log('contact updated'));
  }

  deleteContact(contactKey) {
    this.crmData.deleteContact(contactKey, this.clientKey)
    .then( _ => console.log('contact deleted'));
  }

  editName(newName) {
    this.crmData.editClientName(newName, this.clientObj, this.clientKey);
  }

}
