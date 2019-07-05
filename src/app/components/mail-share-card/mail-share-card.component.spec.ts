import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailShareCardComponent } from './mail-share-card.component';

describe('MailShareCardComponent', () => {
  let component: MailShareCardComponent;
  let fixture: ComponentFixture<MailShareCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailShareCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailShareCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
