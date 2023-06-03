const express = require("express");
const router = express.Router();
const {
  addcampaign,
  UpdateCampaign,
  DeleteCampaign,
  GetCampaign,
  GetJoinedCampaign,
  UnregisteredCampaign,
  joinCampaign,
} = require("../controllers/campaign");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");
router.route("/addcampaign").post(auth, roles, addcampaign);
router.route("/updatePost/:id").patch(auth, roles, UpdateCampaign);
router.route("/DeleteCampaign/:id").delete(auth, roles, DeleteCampaign);
router.route("/FindAllCampaign").get(GetCampaign);
router.route("/GetJoinedCampaign").get(auth, GetJoinedCampaign);
router.route("/UnregisteredCampaign").get(auth, UnregisteredCampaign);
router.route("/joinCampaign").post(auth, joinCampaign);
module.exports = router;
