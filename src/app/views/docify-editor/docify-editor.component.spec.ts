import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocifyEditorComponent } from './docify-editor.component';

describe('DocifyEditorComponent', () => {
  let component: DocifyEditorComponent;
  let fixture: ComponentFixture<DocifyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocifyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocifyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
