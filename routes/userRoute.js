const express = require("express");
const router = express.Router();
const { signin, signup, changePassword } = require("../controllers/users");
router.route("/signin").post(signin);
//router.post("/signin", signin);
router.route("/signup").post(signup);
//router.post("/signup", signup);
router.route("/forgotPassword").patch(changePassword);
module.exports = router;
