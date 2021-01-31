import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S3StoreComponent } from './s3-store.component';

describe('S3StoreComponent', () => {
  let component: S3StoreComponent;
  let fixture: ComponentFixture<S3StoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S3StoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(S3StoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
