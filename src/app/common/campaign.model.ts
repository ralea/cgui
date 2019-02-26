export class Campaign {
  public _id: string;
  public campaignID: string;
  public campaignCode: string;
  public nCampaignCode: number;
  public creator: string;

  constructor(cmpID: string, cmpCode: string, nCmpCode: number, userId: string) {
    this.campaignID = cmpID;
    this.campaignCode = cmpCode;
    this.nCampaignCode = nCmpCode;
  }
}
