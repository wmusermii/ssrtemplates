import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loanrequest } from './loanrequest';

describe('Loanrequest', () => {
  let component: Loanrequest;
  let fixture: ComponentFixture<Loanrequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loanrequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loanrequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
