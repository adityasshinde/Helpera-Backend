const express = require("express");
const router = express.Router();
const {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
} = require("../controllers/campaign");
router.route("/addcampaign").post(addcampaign);
router.route("/updatePost/:id").patch(UpdateCampaign);
router.route("/DeleteCampaign/:id").delete(DeleteCampaign);
router.route("/FindAllCampaign").get(GetCampaign);
module.exports = router;
