import { TestBed } from '@angular/core/testing';

import { CampaignProviderService } from './campaign-provider.service';

describe('CampaignProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CampaignProviderService = TestBed.get(CampaignProviderService);
    expect(service).toBeTruthy();
  });
});
