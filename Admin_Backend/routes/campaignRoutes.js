const express = require("express");
const router = express.Router();
const multer = require("multer");
const campaigns = require("../controller/campaignController");
const authenticate = require("../middleware/authenticate");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/show", campaigns.showCampaigns);

router.post(
  "/upload",

  upload.array("images", 5),
  campaigns.uploadImages
);

router.delete("/delete/:campaignsId", campaigns.deleteCampaigns);
router.put(
  "/update/:campaignsId",
  upload.array("images", 3),
  campaigns.updateCampaigns
);

module.exports = router;
