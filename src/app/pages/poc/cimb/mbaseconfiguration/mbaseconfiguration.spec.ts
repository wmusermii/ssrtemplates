import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mbaseconfiguration } from './mbaseconfiguration';

describe('Mbaseconfiguration', () => {
  let component: Mbaseconfiguration;
  let fixture: ComponentFixture<Mbaseconfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mbaseconfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mbaseconfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
