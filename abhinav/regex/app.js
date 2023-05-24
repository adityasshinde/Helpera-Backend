const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();
const upload = multer();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const userNameRegEx = /^[a-zA-Z0-9_]{4,12}$/;
const passwordRegEx = /^[a-zA-Z0-9_]{6,12}$/;
const emailRegEx = /^[a-zA-Z0-9]{5,12}@(gmail|outlook|yahoo|rediff).com$/;

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", upload.none(), (req, res) => {
  const { Uname, passwd, mail } = req.body;

  if (!userNameRegEx.test(Uname)) {
    const alertScript = "<script>alert('Invalid username');</script>";
    return res.status(400).send(alertScript);
  }

  if (!passwordRegEx.test(passwd)) {
    const alertScript = "<script>alert('Invalid password');</script>";
    return res.status(400).send(alertScript);
  }

  if (!emailRegEx.test(mail)) {
    const alertScript = "<script>alert('Invalid email');</script>";
    return res.status(400).send(alertScript);
  }

  console.log("Username:", Uname);
  console.log("Password:", passwd);
  console.log("Email:", mail);
  res.render("index");
});

//==================================================================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on the port 5000");
});
