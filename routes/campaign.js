const express = require("express");
const router = express.Router();
const {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
} = require("../controllers/campaign");
const auth=require('../middlewares/auth');
router.route("/addcampaign").post(auth,addcampaign);
router.route("/updatePost/:id").patch(auth,UpdateCampaign);
router.route("/DeleteCampaign/:id").delete(auth,DeleteCampaign);
router.route("/FindAllCampaign").get(GetCampaign);
module.exports = router;
