const express = require("express");
const util = require("util");
// const Formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const multiparty = require("multiparty");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();

app.use(express.static("public"));

app.post("/upload", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    const filePath = files.upload[0].path;
    let ext = filePath.slice(-3);
    console.log(ext);
    let response;
    if (
      ext == "png" ||
      ext == "jpg" ||
      ext == "jpeg" ||
      ext == "gif" ||
      ext == "svg"
    ) {
      response = cloudinary.uploader.upload(filePath);
      response
        .then((data) => {
          console.log(data.asset_id, data.public_id);
          console.log(data.secure_url);
        })
        .catch((err) => {
          console.log(err);
        });

      // uploading to mongoDB -----------------------------------------
      const { MongoClient } = require("mongodb");
      const uri = process.env.MONGO_URI;
      const client = new MongoClient(uri);
      client.connect();
      const db = client.db("Help");
      const collection = db.collection("iNeedHelp");
      let dataEntry = {
        asset_id: "",
        public_id: "",
        url: "",
      };
      response
        .then((data) => {
          dataEntry.asset_id = data.asset_id;
          dataEntry.public_id = data.public_id;
          dataEntry.url = data.secure_url;
          collection.insertOne(dataEntry, function (err, result) {
            if (err) {
              console.error("Error inserting data:", err);
              return;
            }
            console.log("Data inserted successfully");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

app.post("/edit", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    const id = fields.obj[0];
    const pubId = fields.public[0];
    const assetId = fields.asset[0];
    const filePath = files.edit[0].path;
    let ext = filePath.slice(-3);
    console.log(id);
    let response;
    if (
      ext == "png" ||
      ext == "jpg" ||
      ext == "jpeg" ||
      ext == "gif" ||
      ext == "svg"
    ) {
      response = cloudinary.uploader.upload(filePath, {
        public_id: pubId,
        asset_id: assetId,
      });
      response
        .then((data) => {
          console.log(data.asset_id, data.public_id);
          console.log(data.secure_url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // uploading to mongoDB -----------------------------------------

    const { MongoClient, ObjectId } = require("mongodb");
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    client.connect();
    const db = client.db("Help");
    const collection = db.collection("iNeedHelp");
    let dataEntry = {
      asset_id: "",
      public_id: "",
      url: "",
    };
    response
      .then((data) => {
        dataEntry.asset_id = data.asset_id;
        dataEntry.public_id = data.public_id;
        dataEntry.url = data.secure_url;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: dataEntry };
        collection.updateOne(filter, updateDoc);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app
  .get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
<!doctype html>
            <html lang="en">

            <head>
                <title>CLOUDINARY UPLOADER</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
                    * {
                        font-family: Montserrat;
                    }
                </style>
                </head>
            <body>
             <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
             <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
             <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
             <div class="container">
                    <br>
                    <h1 class="text-center">CLOUDINARY UPLOADER</h1>
                   <form action="/upload" enctype="multipart/form-data" method="post">
                         <div class="form-group">
                              <label for="upload-image-file"></label>
                              <input type="file" class="form-control-file" name="upload" id="upload" placeholder="upload-image-file" aria-describedby="fileHelpId">
                              <small id="fileHelpId" class="form-text text-muted">Please select the image to be uploaded...</small>
                          </div>
                         <button type="submit" class="btn btn-primary" value="Upload">Upload</button>
                  </form>
                  <br><br>
                  <! =============================================================================================================================================== >
                  <form action="/edit" enctype="multipart/form-data" method="post">
                         <div class="form-group">
                              <input type="text" class="form-control-file" name="obj" id="obj" placeholder="objId of file to be edited" aria-describedby="fileHelpId"><br>
                              <input type="text" class="form-control-file" name="asset" id="asset" placeholder="assetId of file tobe edited" aria-describedby="fileHelpId"><br>
                              <input type="text" class="form-control-file" name="public" id="public" placeholder="publicId of file tobe edited" aria-describedby="fileHelpId">
                              <label for="edit-image-file"></label>
                              <input type="file" class="form-control-file" name="edit" id="edit" placeholder="upload-image-file" aria-describedby="fileHelpId">
                              <small id="fileHelpId" class="form-text text-muted">Please select the image to be uploaded...</small>
                          </div>
                         <button type="submit" class="btn btn-primary" value="Upload">edit</button>
                  </form>
                </div>
            </body>
        </html>
`);
  })
  .listen(3000, () => {
    console.log("listening on port 3000");
  });
