import { Component, OnInit, OnDestroy } from '@angular/core';
import { CampaignProvider } from '../../data/campaign-provider.service';
import { Campaign } from '../../common/campaign.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})


export class CampaignsComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [new Campaign(null, null, null, null)];
  public userIsAuthenticated = false;
  private campaignSubs: Subscription;
  private authStatusSubs: Subscription;
  userId: string ;
  totalPosts = 10;
  itemsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10 ];
  // campaignSent = false;
  constructor(private campaignProvider: CampaignProvider, private authService: AuthService) { }

  ngOnInit() {
    this.campaignProvider.getCampaigns(this.itemsPerPage, this.currentPage);
    this.userId = this.authService.getUserId() ;
    this.campaignSubs = this.campaignProvider.getCampaignsListener().subscribe(
      (campaignsData: {campaigns: Campaign[], maxCampaigns: number}) => {
        console.log('Get campaigns: ' + campaignsData.campaigns) ;
        this.campaigns = campaignsData.campaigns;
        this.totalPosts = campaignsData.maxCampaigns;
      }
    );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe (
      isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId() ;
    });
  }

  onDelete(cID: string) {
    this.campaignProvider.deleteCampaign(cID).subscribe(() => {
      this.campaignProvider.getCampaigns(this.itemsPerPage, this.currentPage);
    });
  }

  onChangePage(data: PageEvent) {
    this.currentPage = data.pageIndex + 1;
    this.itemsPerPage = data.pageSize;
    this.campaignProvider.currentPage = this.currentPage ;
    this.campaignProvider.itemsPerPage = this.itemsPerPage;
    this.campaignProvider.getCampaigns(this.itemsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
