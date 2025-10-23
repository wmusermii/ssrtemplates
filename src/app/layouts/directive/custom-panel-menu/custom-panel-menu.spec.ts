import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPanelMenu } from './custom-panel-menu';

describe('CustomPanelMenu', () => {
  let component: CustomPanelMenu;
  let fixture: ComponentFixture<CustomPanelMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPanelMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPanelMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
