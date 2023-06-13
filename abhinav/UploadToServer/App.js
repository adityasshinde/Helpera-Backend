const express = require("express");
const multer = require("multer");
const app = express();

// Must Include this
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded!");

  // Cloudinary code here
  // Cloudinary code here
  // cloudianry code here

  setTimeout(() => {
    const fs = require("fs");

    // Define the path to the file you want to delete
    console.log(req.file.path);
    const filePath = req.file.path;

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log("File deleted successfully!");
    });
  }, 10000);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
