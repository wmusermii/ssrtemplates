import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flowcanvas } from './flowcanvas';

describe('Flowcanvas', () => {
  let component: Flowcanvas;
  let fixture: ComponentFixture<Flowcanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flowcanvas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flowcanvas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
