import { TestBed } from '@angular/core/testing';

import { S3StoreService } from './s3-store.service';

describe('S3StoreService', () => {
  let service: S3StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
