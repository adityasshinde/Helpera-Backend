const express = require("express");
const router = express.Router();
const {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
} = require("../controllers/campaign");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");
router.route("/addcampaign").post(auth, roles, addcampaign);
router.route("/updatePost/:id").patch(auth, roles, UpdateCampaign);
router.route("/DeleteCampaign/:id").delete(auth, roles, DeleteCampaign);
router.route("/FindAllCampaign").get(auth, GetCampaign);
module.exports = router;
