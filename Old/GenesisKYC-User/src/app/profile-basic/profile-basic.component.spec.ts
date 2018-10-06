import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileBasicComponent } from './profile-basic.component';

describe('ProfileBasicComponent', () => {
  let component: ProfileBasicComponent;
  let fixture: ComponentFixture<ProfileBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
