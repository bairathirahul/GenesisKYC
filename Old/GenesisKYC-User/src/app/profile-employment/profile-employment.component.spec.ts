import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmploymentComponent } from './profile-employment.component';

describe('ProfileEmploymentComponent', () => {
  let component: ProfileEmploymentComponent;
  let fixture: ComponentFixture<ProfileEmploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEmploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
