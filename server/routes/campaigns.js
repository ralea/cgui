const express = require('express');
const Campaign = require("../models/campaign");
const checkauth = require("../middleware/check-auth")

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  next();
});

router.post("", checkauth, (req, res, next) => {
  console.log('Saving campaign!');
  const data = req.body;
  const camp = new Campaign({
    campaignID: data.campaignID,
    campaignCode: data.campaignCode,
    nCampaignCode: data.nCampaignCode,
    creator: req.userData.userId
  });
  camp.save().then(result => {
    res.status(201).json({message: "Campaign saved!", _id: result._id});
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const query = Campaign.find();
  let fetchedPosts;
  if (pageSize && currentPage){
    query.skip(pageSize * (currentPage-1))
    .limit(pageSize);
  }

  query.then(docs => {
    fetchedPosts = docs;
    return Campaign.count();
  }).then(count => {
    res.status(200).json({campaigns:fetchedPosts, maxCampaigns: count});
  });
});

router.delete("/:id", checkauth, (req, res, next) => {
  Campaign.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if ( result.n > 0 ){
      res.status(200).json({ message: "Campaign deleted!" });
    } else {
      res.status(401).json( {message: "Not authorized" });
    };
  });
});

router.put("/:id", checkauth, (req, res, next) => {
  console.log('Put: ' + req.params.id + '/' + req.body.campaignID);
  const camp = new Campaign({
    _id: req.params.id,
    campaignID: req.body.campaignID,
    campaignCode: req.body.campaignCode,
    nCampaignCode: req.body.nCampaignCode,
    creator: req.userData.userId
  });
  console.log(camp);
  Campaign.updateOne({_id: req.params.id, creator: req.userData.userId}, camp).
  then(
    result => {
      console.log('Put result' + result);
      if ( result.nModified > 0 ){
        res.status(200).json({ message: "Campaign updated!" });
      } else {
        res.status(401).json( {message: "Not authorized" });
      }
    }
  ) ;
});

module.exports = router;








