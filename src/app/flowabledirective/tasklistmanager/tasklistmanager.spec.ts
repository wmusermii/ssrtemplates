import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasklistmanager } from './tasklistmanager';

describe('Tasklistmanager', () => {
  let component: Tasklistmanager;
  let fixture: ComponentFixture<Tasklistmanager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasklistmanager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasklistmanager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
