import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ScrollToTopComponent} from './scroll-to-top.component';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollToTopComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
