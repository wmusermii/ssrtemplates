import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generalmanagement } from './generalmanagement';

describe('Generalmanagement', () => {
  let component: Generalmanagement;
  let fixture: ComponentFixture<Generalmanagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generalmanagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Generalmanagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
