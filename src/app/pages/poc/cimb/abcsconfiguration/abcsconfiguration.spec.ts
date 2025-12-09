import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Abcsconfiguration } from './abcsconfiguration';

describe('Abcsconfiguration', () => {
  let component: Abcsconfiguration;
  let fixture: ComponentFixture<Abcsconfiguration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Abcsconfiguration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Abcsconfiguration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
