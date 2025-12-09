import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Komiconfiguration } from './komiconfiguration';

describe('Komiconfiguration', () => {
  let component: Komiconfiguration;
  let fixture: ComponentFixture<Komiconfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Komiconfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Komiconfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
