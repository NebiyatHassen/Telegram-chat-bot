const express = require("express");
const router = express.Router();
const multer = require("multer");
const jobfair = require("../controller/jobfairController");
const authenticate = require("../middleware/authenticate");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/showjobfair", jobfair.showjobfair);

router.post(
  "/upload",

  upload.array("images", 5),
  jobfair.uploadImages
);

router.delete("/deletejobfair/:jobfairID", jobfair.deletejobfair);
router.put(
  "/update/:jobfairId",

  upload.array("images", 3),
  jobfair.updateJobfair
);

module.exports = router;
