import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesPageComponent } from './grades-page.component';

describe('GradesPageComponent', () => {
  let component: GradesPageComponent;
  let fixture: ComponentFixture<GradesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradesPageComponent]
    });
    fixture = TestBed.createComponent(GradesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
