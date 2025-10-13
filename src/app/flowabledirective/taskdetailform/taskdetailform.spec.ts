import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Taskdetailform } from './taskdetailform';

describe('Taskdetailform', () => {
  let component: Taskdetailform;
  let fixture: ComponentFixture<Taskdetailform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Taskdetailform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Taskdetailform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
