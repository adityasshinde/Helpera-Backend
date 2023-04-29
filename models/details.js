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
    length: 10,
    require: true,
  },
  Age: {
    type: Number,
    require: true,
  },
  dob: { type: String, require: true },
  campaign: { type: [String], require: true },
  address: { type: String, require: true },
});

const loginUser = mongoose.model("loginUser", loginSchema);

module.exports = loginUser;
