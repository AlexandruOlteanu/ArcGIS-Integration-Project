import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassw2Component } from './change-passw2.component';

describe('ChangePassw2Component', () => {
  let component: ChangePassw2Component;
  let fixture: ComponentFixture<ChangePassw2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePassw2Component]
    });
    fixture = TestBed.createComponent(ChangePassw2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
