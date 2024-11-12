const express = require("express");
const router = express.Router();
const multer = require("multer");
const training = require("../controller/trainingcontroller");
const authenticate = require("../middleware/authenticate");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/showtraining", training.showtraining);

router.post(
  "/upload",

  upload.array("images", 5),
  training.uploadImages
);

router.delete("/delete/:trainingId", training.deletedtraining);
router.put(
  "/update/:trainingId",

  upload.array("images", 3),
  training.updateJobfair
);

module.exports = router;
