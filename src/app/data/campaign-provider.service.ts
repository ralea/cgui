import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Campaign } from './../common/campaign.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CampaignProvider {
  campaignsUrl = 'http://localhost:3000/api/campaigns';
  campaigns: Campaign[] = null;
  maxCampaigns: number;
  itemsPerPage = 2;
  currentPage = 1;

  private campaignUpdated = new Subject<{campaigns: Campaign[], maxCampaigns: number}>();
  constructor(private http: HttpClient, public router: Router) {}

  addCampaign(camp: Campaign) {
    return this.http.post<{ message: string; _id: string }>(this.campaignsUrl, camp)
      .subscribe(response => {
        camp._id = response._id;
        this.campaigns.push(camp);
        this.getCampaigns(this.itemsPerPage, this.currentPage);
      });
  }

  addCamp(camp: Campaign) {
    this.campaigns.push(camp);
  }

  setCampaigns(camps: Campaign[]) {
    this.campaigns = [];
    camps.forEach(camp => {
      this.addCamp(camp);
    });
  }

  addCampaigns(camps: Campaign[]) {
    camps.forEach(camp => {
      this.addCamp(camp);
    });
    this.campaignUpdated.next({campaigns: [...this.campaigns], maxCampaigns: this.maxCampaigns});
  }

  getCampaigns(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    this.http.get<{campaigns: Campaign[], maxCampaigns: number}>(this.campaignsUrl + queryParams).subscribe(campaignData => {
      console.log(campaignData) ;
      this.setCampaigns(campaignData.campaigns);
      this.maxCampaigns = campaignData.maxCampaigns;
      this.campaignUpdated.next({campaigns: [...this.campaigns], maxCampaigns: this.maxCampaigns});
    });
  }

  getCampaign(id: string) {
    return { ...this.campaigns.find(p => p._id === id) };
  }
  /* sendCampaigns() {
    return this.http.post <{message: string}>(this.campaignsUrl, this.campaigns);
  } */

  getCampaignsListener() {
    return this.campaignUpdated.asObservable();
  }

  deleteCampaign(cID: string) {
    return this.http.delete(this.campaignsUrl + '/' + cID);
  }

  updateCampaign(cID: string, camp: Campaign) {
    this.http.put(this.campaignsUrl + '/' + cID, camp).subscribe((result: string) => {
      const updatedCampaigs = [...this.campaigns];
      const oldcmpIndex = updatedCampaigs.findIndex(p => p._id === cID);
      updatedCampaigs[oldcmpIndex] = camp;
      this.campaigns = updatedCampaigs ;
      this.campaignUpdated.next({campaigns: [...this.campaigns], maxCampaigns: this.maxCampaigns});
    });
  }
}
