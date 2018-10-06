import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRequestComponent } from './profile-request.component';

describe('ProfileRequestComponent', () => {
  let component: ProfileRequestComponent;
  let fixture: ComponentFixture<ProfileRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
