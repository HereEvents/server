const express = require("express");
const filesRouter = express.Router();
const multer = require("multer");

const fs = require("fs");

const uuidv4 = require("uuid/v4");
const { sendError } = require("../errController");
const url = "localhost:5000";
const DIR = "upload";
// const multiUpload = upload.fields([
//   { name: "cardImageURL", maxCount: 1 },
//   { name: "coverImageURL", maxCount: 1 },
//   { name: "gallery", maxCount: 5 },
// ]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const { mimetype } = file;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    cb(
      null,
      `${originalname.split(".")[0]}-${today
        .toLocaleString()
        .replace(/[-\/:]/g, "")}.${originalname.split(".")[1]}`
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

filesRouter.post("/uploadFile", upload.array("file"), (req, res) => {
  res.json({ status: "success" });
});

// filesRouter.post("/uploadFile", multiUpload, (req, res) => {
//   for (const key in req.files) {
//     if (Object.hasOwnProperty.call(object, key)) {
//       const element = object[key];
//
//     }
//   }
//   buildStaticUrl(req, res);
// });
module.exports = filesRouter;
