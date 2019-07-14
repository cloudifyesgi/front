import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDefaultLayoutComponent } from './admin-default-layout.component';

describe('AdminDefaultLayoutComponent', () => {
  let component: AdminDefaultLayoutComponent;
  let fixture: ComponentFixture<AdminDefaultLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDefaultLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
