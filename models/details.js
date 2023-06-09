const mongoose = require("mongoose");

const loginSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  id: {
    type: String,
    require: true,
  },
  phoneNo: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    require: true,
  },
  Age: {
    type: Number,
  },
  dob: { type: String },
  campaigns: { type: [String], require: true },
  address: { type: String, require: true },
  SecurityQuestion: {
    type: String,
    require: true,
  },
  role: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  Total: {
    type: Number,
    default: 0,
  },
  image_asset_id: {
    type: String,
    default: "",
  },
  image_public_id: {
    type: String,
    default: "",
  },
  image_url: {
    type: String,
    default: "",
  },
});

const campaignSchema = mongoose.Schema({
  CampaignName: {
    type: String,
    require: true,
  },
  CampaignType: {
    type: [String],
    require: true,
  },
  CreatedBYId: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  OrgName: {
    type: String,
    require: true,
  },
  CampHeadName: {
    type: String,
    require: true,
  },
  ContactNo: {
    type: Number,
    require: true,
  },
  VoluntersNeeded: {
    type: Number,
    require: true,
  },
  Address: {
    type: String,
    require: true,
  },
  StartDate: {
    type: String,
    require: true,
  },
  EndDate: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  file: {
    type: String,
  },
  comment: {
    type: [String],
  },
  VolunteersJoined: {
    type: [String],
    default: [],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  brochure: {
    data: Buffer,
    contentType: String,
  },
  image_asset_id: {
    type: String,
    default: "",
  },
  image_public_id: {
    type: String,
    default: "",
  },
  image_url: {
    type: String,
    default: "",
  },
});
const loginUser = mongoose.model("loginUser", loginSchema);
const CreateCampaign = mongoose.model("CreateCampaign", campaignSchema);
module.exports = { loginUser, CreateCampaign };
