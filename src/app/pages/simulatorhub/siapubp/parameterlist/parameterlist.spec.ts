import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parameterlist } from './parameterlist';

describe('Parameterlist', () => {
  let component: Parameterlist;
  let fixture: ComponentFixture<Parameterlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Parameterlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Parameterlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
