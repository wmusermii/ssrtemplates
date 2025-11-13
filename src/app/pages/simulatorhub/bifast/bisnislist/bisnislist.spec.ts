import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bisnislist } from './bisnislist';

describe('Bisnislist', () => {
  let component: Bisnislist;
  let fixture: ComponentFixture<Bisnislist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bisnislist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bisnislist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
