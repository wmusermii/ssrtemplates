import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Companylist } from './companylist';

describe('Companylist', () => {
  let component: Companylist;
  let fixture: ComponentFixture<Companylist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Companylist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Companylist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
