import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CampaignProvider } from './../../data/campaign-provider.service';
import { Campaign } from './../../common/campaign.model';
import { ActivatedRoute, RouterModule, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-newcampaign',
  templateUrl: './newcampaign.component.html',
  styleUrls: ['./newcampaign.component.css']
})

export class NewcampaignComponent implements OnInit {
  private editMode = 'create';
  private campID: string;
  public campaign: Campaign = new Campaign(null, null, null, null) ;
  constructor(private campaignProvider: CampaignProvider, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      if (paramMap.has('id')) {
        this.editMode = 'edit';
        this.campID = paramMap.get('id');
        this.campaign = this.campaignProvider.getCampaign(this.campID);
        console.log('HasID: ' + this.campaign);
      } else {
        this.editMode = 'create';
        this.campID = null;
      }
    }) ;
  }

  onSubmit(form: NgForm) {
    const camp = new Campaign(form.value.campaignID, form.value.campaignCode, form.value.nCampaignCode, null);
    if (this.editMode === 'create') {
      this.campaignProvider.addCampaign(camp);
      form.reset();
    } else {
      this.campaignProvider.updateCampaign(this.campID, camp);
      form.reset();
      this.router.navigate(['campaigns']);
    }

  }
}
