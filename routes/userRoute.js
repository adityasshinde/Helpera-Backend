const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controllers/users");
router.route("/signin").post(signin);
//router.post("/signin", signin);
router.route("/signup").post(signup);
//router.post("/signup", signup);
module.exports = router;
