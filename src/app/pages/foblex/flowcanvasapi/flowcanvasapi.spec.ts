import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flowcanvasapi } from './flowcanvasapi';

describe('Flowcanvasapi', () => {
  let component: Flowcanvasapi;
  let fixture: ComponentFixture<Flowcanvasapi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flowcanvasapi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flowcanvasapi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
