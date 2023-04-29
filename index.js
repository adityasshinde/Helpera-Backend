const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/post.js");
const userRoute = require("./routes/userRoute.js");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoute);
const CONNECTION_URL =
  "mongodb+srv://Gaurav:123123juvi@nodeproject1.8pzpuwr.mongodb.net/?retryWrites=true&w=majority";

const port = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL)
  .then(() =>
    app.listen(port, () => console.log(`server is connected on ${port}`))
  )
  .catch((error) => console.log(error.message));
