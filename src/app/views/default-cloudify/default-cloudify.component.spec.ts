import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCloudifyComponent } from './default-cloudify.component';

describe('DefaultCloudifyComponent', () => {
  let component: DefaultCloudifyComponent;
  let fixture: ComponentFixture<DefaultCloudifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultCloudifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultCloudifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
