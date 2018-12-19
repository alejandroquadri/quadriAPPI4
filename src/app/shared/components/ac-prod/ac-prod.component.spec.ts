import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcProdComponent } from './ac-prod.component';

describe('AcProdComponent', () => {
  let component: AcProdComponent;
  let fixture: ComponentFixture<AcProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
