const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const campaigns = require("../models/campaigns");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "ds3wsc8as",
  api_key: "714722695687768",
  api_secret: "iTi78ih5itaEnbiFF8oc7raVbvw",
});

const uploadImages = async (req, res) => {
  try {
    const imageUrls = [];

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No files uploaded." });
    }
    if (req.files.length > 4) {
      return res
        .status(400)
        .json({ success: false, error: "Maximum of 3 files allowed." });
    }
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        if (file.size > 10485760) {
          reject({
            success: false,
            error: `File ${file.originalname} is too large. Maximum size is 10 MB.`,
          });
        }

        const folder = "DerejaCampaign";

        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: folder },
          (error, result) => {
            if (error) {
              console.error("Error uploading to Cloudinary:", error);
              reject({
                success: false,
                error: "Error uploading to Cloudinary",
              });
            }
            imageUrls.push(result.secure_url);
            resolve();
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    await Promise.all(uploadPromises);
    if (
      req.body.Title === "" ||
      req.body.Locations === "" ||
      req.body.DateTime === "" ||
      req.body.Detail === ""
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const newcampaigns = new campaigns({
      Title: req.body.Title,
      Locations: req.body.Locations,
      DateTime: req.body.DateTime,
      Detail: req.body.Detail,
      imageUrls: imageUrls,
    });

    const savedcampaigns = await newcampaigns.save();

    res.json({
      success: true,
      message: "campaigns information added successfully",
      data: {
        newcampaigns: savedcampaigns,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

const showCampaigns = (req, res, next) => {
  campaigns
    .find()
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((error) => {
      res.json({
        message: "An error Occurred!",
      });
    });
};

const deleteCampaigns = async (req, res) => {
  try {
    const { campaignsId } = req.params;

    const deletedcampaigns = await campaigns.findByIdAndDelete(campaignsId);

    if (!deletedcampaigns) {
      return res
        .status(404)
        .json({ success: false, error: "campaigns informations not found" });
    }

    res.json({ success: true, message: "campaigns info deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};
const updateCampaigns = async (req, res) => {
  try {
    const { campaignsId } = req.params;

    const existingCampaign = await campaigns.findById(campaignsId);
    if (!existingCampaign) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign info not found." });
    }

    let imageUrls = existingCampaign.imageUrls || [];

    if (req.files && req.files.length > 0) {
      const newImageUrls = [];
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          if (file.size > 10485760) {
            reject({
              success: false,
              error: `File ${file.originalname} is too large. Maximum size is 10 MB.`,
            });
          }

          const folder = "DerejaCampaign";
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: folder },
            (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error);
                reject({
                  success: false,
                  error: "Error uploading to Cloudinary",
                  file: file.originalname,
                });
              } else {
                newImageUrls.push(result.secure_url);
                resolve();
              }
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      await Promise.all(uploadPromises);
      imageUrls = newImageUrls;
    }

    const updatedData = {
      Title: req.body.Title,
      Locations: req.body.Locations,
      DateTime: req.body.DateTime,
      Detail: req.body.Detail,
      imageUrls: imageUrls,
    };

    const updatedCampaigns = await campaigns.findByIdAndUpdate(
      campaignsId,
      updatedData,
      { new: true }
    );

    if (!updatedCampaigns) {
      return res
        .status(404)
        .json({ success: false, error: "Campaign info not found." });
    }

    res.json({
      success: true,
      message: "Campaign info updated successfully",
      data: updatedCampaigns,
    });
  } catch (error) {
    console.error("Server error:", error);

    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, error: "Internal Server Error", data: null });
    }
  }
};

module.exports = {
  uploadImages,
  showCampaigns,
  updateCampaigns,
  deleteCampaigns,
};
