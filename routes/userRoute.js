const express = require("express");
const router = express.Router();
const {
  signin,
  signup,
  changePassword,
  userDetail,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
//router.route("/signin").post(signin);
router.post("/signin", signin);
//router.post("/signin", signin);
//router.route("/signup").post(signup);
router.post("/signup", signup);
//router.post("/signup", signup);
//router.route("/forgotPassword").patch(changePassword);
router.patch("/forgotPassword", changePassword);
//router.get(":/id/userDetail", auth, userDetail);
router.route("/userDetail").get(auth, userDetail);
module.exports = router;
