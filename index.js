const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoute = require("./routes/userRoute");
const campaign = require("./routes/campaign");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoute);
app.use("/organisation", campaign);

const port = process.env.PORT || 5000;
mongoose
  .connect(
    "mongodb+srv://Gaurav:123123juvi@nodeproject1.8pzpuwr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() =>
    app.listen(port, () => console.log(`server is connected on ${port}`))
  )
  .catch((error) => console.log(error.message));
