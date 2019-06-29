import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFolderComponent } from './share-folder.component';

describe('ShareFolderComponent', () => {
  let component: ShareFolderComponent;
  let fixture: ComponentFixture<ShareFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
