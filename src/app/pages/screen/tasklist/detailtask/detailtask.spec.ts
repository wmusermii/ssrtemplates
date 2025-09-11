import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detailtask } from './detailtask';

describe('Detailtask', () => {
  let component: Detailtask;
  let fixture: ComponentFixture<Detailtask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detailtask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detailtask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
