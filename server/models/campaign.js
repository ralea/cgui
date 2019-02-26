const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
  campaignID: {type: String, required: true},
  campaignCode: {type: String, required: true},
  nCampaignCode: {type: Number, required: true},
  creator: {type:mongoose.Schema.Types.ObjectId, ref:"User", required: true}
});

module.exports = mongoose.model('Campaign', campaignSchema);
