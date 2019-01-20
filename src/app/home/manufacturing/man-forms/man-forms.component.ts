import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NavParams, Platform } from '@ionic/angular';
import { StaticDataService, ProductionService } from '../../../shared';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-man-forms',
  templateUrl: './man-forms.component.html',
  styleUrls: ['./man-forms.component.scss']
})
export class ManFormsComponent implements OnInit {

  public myForm: FormGroup;
  @ViewChild('dateInput') dateInput;
  updateForm$: any;
  updateForm: any;
  editBtn = false;
  data: any;
  key: string;


  constructor(
    public _fb: FormBuilder,
    // public navParams: NavParams,
    public platform: Platform,
    private prodData: ProductionService,
    private staticData: StaticDataService,
    private loc: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.data = this.staticData.data.produccion;
  }

  ngOnInit() {
    this.buildForm();
    this.key = this.route.snapshot.paramMap.getAll('id')[0];
    if (this.key) {
      this.updateForm$ = this.prodData.getProdLog(this.key)
      .subscribe( data => {
        // console.log(data);
        this.editBtn = true;
        this.updateForm = data;
        this.updateForm['$key'] = this.key;
        this.buildEdit();
      });
    }
    this.focusDate();
  }

  buildForm() {
    this.myForm = this._fb.group({
      date: ['', Validators.required],
      machine: ['', Validators.required],
      color: ['', Validators.required],
      dim: ['', Validators.required],
      drawing: ['', Validators.required],
      mod: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      prod: ['', Validators.required],
      seg: [''],
      rep: [''],
      broken: [''],
      observaciones: [''],
      stops: this._fb.array([]),
    });
  }

  buildEdit() {
    this.myForm.patchValue({
      date: this.updateForm.date,
      machine: this.updateForm.machine,
      color: this.updateForm.color,
      dim: this.updateForm.dim,
      drawing: this.updateForm.drawing,
      mod: this.updateForm.mod,
      start: this.updateForm.start,
      end: this.updateForm.end,
      prod: this.updateForm.prod,
      seg: this.updateForm.seg,
      rep: this.updateForm.rep,
      broken: this.updateForm.broken,
      observaciones: this.updateForm.observaciones,
    });

    if (this.updateForm.stops) {
      // console.log('hay paradas');
      const control = <FormArray> this.myForm.controls['stops'];
      const stopArr = Object.keys(this.updateForm.stops);
      stopArr.forEach( stop => {
        control.push(this.initEditParada(
          this.updateForm.stops[stop].startP,
          this.updateForm.stops[stop].endP,
          this.updateForm.stops[stop].cause)
        );
      });
    }
  }

  initParada() {
    return this._fb.group({
      startP: ['', Validators.required],
      endP: ['', Validators.required],
      cause: ['', Validators.required]
    });
  }

  initEditParada(start, end, cause) {
    return this._fb.group({
      startP: [start, Validators.required],
      endP: [end, Validators.required],
      cause: [cause, Validators.required]
    });
  }

  addStop() {
    const control = <FormArray>this.myForm.controls['stops'];
    control.push(this.initParada());
  }

  removeStop(i: number) {
    const control = <FormArray>this.myForm.controls['stops'];
    control.removeAt(i);
  }

  clearStops() {
    this.myForm.controls['stops'] = this._fb.array([]);
  }

  get stopsArray() {
    return <FormArray>this.myForm.get('stops');
  }

  submit() {
    if (!this.editBtn) {
      this.save();
    } else {
      this.edit();
    }
  }

  save() {
    const prod = this.myForm.value;
    const stops = this.myForm.value.stops;
    // console.log(stops);
    delete prod.stops;

    this.prodData.pushProduction(prod)
    .then( (ret: any) => {
      // console.log(ret);
      if (stops.length > 0) {
        this.prodData.setProdStop(ret.key, prod, stops);
      }
    })
    .then( () => {
      // console.log('stops saved');
      this.buildForm(); // esto es para que borre las entradas de stops
    });
    this.myForm.reset();
    this.focusDate();
  }

  edit() {
    const prod = this.myForm.value;
    const stops = this.myForm.value.stops;
    delete prod.stops;
    // console.log(this.updateForm);

    if (stops.length > 0) {
      if (!this.updateForm.stops) {
        this.prodData.setProdStop(this.updateForm['$key'], prod, stops);
      } else {
        const stopKeys = Object.keys(this.updateForm.stops);
        // console.log(stopKeys);
        this.prodData.updateProdStop(this.updateForm['$key'], prod, stops, stopKeys)
        .then( () => console.log('terminado update stops'));
      }
    }
    this.prodData.updateProduction(this.updateForm['$key'], prod)
    .then( () => {
      // this.navCtrl.navigateBack();
      this.loc.back();
    });
  }

  isPulidora() {
    if (this.myForm.value.machine === 'Breton'
      || this.myForm.value.machine === 'Lineal'
      || this.myForm.value.machine === 'Pasado tablas'
      || this.myForm.value.machine === 'Granalladora'
      || this.myForm.value.machine === 'Desmolde') {
      return true;
    } else {
      return false;
    }
  }

  isPastina() {
    if (this.myForm.value.machine === 'Pastinas') {
      this.myForm.patchValue({
        dim: 'bolsa 20kg',
        drawing: 'pastina'
      });
      return 'pastinas';
    } else {
      return 'mosaicos';
    }
  }

  focusDate() {
    if (!this.platform.is('mobile')) {
      // let element = this.dateInput._elementRef.nativeElement.getElementsByTagName('input')[0];
      // console.log('focus', element);
      // // element.focus(); esta es otra opcion
      // this.renderer.invokeElementMethod(element,'focus'); y esta otra
      setTimeout(() => {
        this.dateInput.setFocus(); // le pongo un timeout para que haga focus cuando carga
      }, 150);
    }
  }

  pushPrint() {
    this.router.navigate([`home/produccion/cartel`]);
  }

  logs() {
    this.router.navigate([`home/produccion/registros`]);
  }

  newLog() {
    this.router.navigate(['home/produccion/carga-produccion']);
  }

}
