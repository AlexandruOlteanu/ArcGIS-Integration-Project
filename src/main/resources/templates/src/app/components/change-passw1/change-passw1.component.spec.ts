import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassw1Component } from './change-passw1.component';

describe('ChangePassw1Component', () => {
  let component: ChangePassw1Component;
  let fixture: ComponentFixture<ChangePassw1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePassw1Component]
    });
    fixture = TestBed.createComponent(ChangePassw1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
