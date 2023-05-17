// Kifx83ccnmIQEi2b
x = "";
const { MongoClient, ServerApiVersion } = require("mongodb");
const { GridFsStorage } = require("multer-gridfs-storage");
const uri =
  "mongodb+srv://ironmanabhinav1:Kif83ccnmIQEi2b@cluster0.hxyddzw.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

setTimeout(() => {
  const express = require("express");
  const multer = require("multer");
  const { MongoClient, ServerApiVersion } = require("mongodb");
  const methodOverride = require("method-override");
  const bodyParser = require("body-parser");
  const { GridFSBucket } = require("mongodb");
  const { ObjectId } = require("mongodb");
  const fs = require("fs");
  const http = require("http");
  // ============================================================
  const app = express();
  app.use(bodyParser.json());
  app.use(methodOverride("_method"));
  app.set("view engine", "ejs");

  app.get("/", (req, res) => {
    res.render("index");
  });
  // ============================================================

  const uri =
    "mongodb+srv://ironmanabhinav1:Kifx83ccnmIQEi2b@cluster0.hxyddzw.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  //==============================================================================================

  app.post("/upload", upload.single("file"), async (req, res) => {
    try {
      await client.connect();
      const db = client.db("Help");
      const bucket = new GridFSBucket(db);

      // uploading the file
      const writeStream = bucket.openUploadStream(req.file.originalname);
      writeStream.write(req.file.buffer);
      writeStream.end();

      writeStream.on("finish", (file) => {
        res.status(200).json({
          message: "File Uploaded Successfully",
          file_id: file._id,
        });
      });

      //==============================================================================================
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });

  //======================================================================================================

  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/submit", async (req, res) => {
    try {
      const inputValue = req.body.inputValue;
      await client.connect();
      const db = client.db("Help");
      const bucket = new GridFSBucket(db);

      const fileId = new ObjectId(inputValue);
      const file = await bucket.find({ _id: fileId }).toArray();
      if (file.length === 0) {
        res.status(404).send("File not found");
        return;
      }

      res.set("Content-Type", file[0].contentType);
      const readStream = bucket.openDownloadStream(fileId);
      readStream.pipe(res);
    } catch (err) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    }
  });

  //======================================================================================================

  app.get("/download/:fileId", async (req, res) => {
    try {
      await client.connect();
      const db = client.db("Help");
      const bucket = new GridFSBucket(db);

      const fileId = new ObjectId(req.params.fileId);
      const file = await bucket.find({ _id: fileId }).toArray();
      if (file.length === 0) {
        res.status(404).send("File not found");
        return;
      }

      res.set("Content-Type", file[0].contentType);
      const readStream = bucket.openDownloadStream(fileId);
      readStream.pipe(res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });

  const hostName = "172.16.222.86 ";
  const port = 3000;

  app.listen(port, () => {
    console.log("Server started on port 3000");
  });
}, 40000);
