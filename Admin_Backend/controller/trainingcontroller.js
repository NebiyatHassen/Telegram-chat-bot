const cloudinary = require("cloudinary").v2;
const { response } = require("express");
const streamifier = require("streamifier");
const training = require("../models/training");

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

        const folder = "DerejaTraining";

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

    const newtraining = new training({
      Title: req.body.Title,
      Locations: req.body.Locations,
      DateTime: req.body.DateTime,
      Detail: req.body.Detail,
      imageUrls: imageUrls,
    });

    const savedtraining = await newtraining.save();

    res.json({
      success: true,
      message: "Training information added successfully",
      data: {
        newtraining: savedtraining,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};

const showtraining = (req, res, next) => {
  training
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

const deletedtraining = async (req, res) => {
  try {
    const { trainingId } = req.params;

    const deletedjobfair = await training.findByIdAndDelete(trainingId);

    if (!deletedjobfair) {
      return res
        .status(404)
        .json({ success: false, error: "training informations not found" });
    }

    res.json({ success: true, message: "training info deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
};
const updateJobfair = async (req, res) => {
  try {
    const { trainingId } = req.params;

    const existingJobfair = await training.findById(trainingId);

    if (!existingJobfair) {
      return res
        .status(404)
        .json({ success: false, error: "Jobfair not found" });
    }

    let imageUrls = existingJobfair.imageUrls || [];

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

          const folder = "DerejaTraining";
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
    const updatedjobfair = await training.findByIdAndUpdate(
      trainingId,
      updatedData,
      { new: true }
    );

    if (!updatedjobfair) {
      return res
        .status(404)
        .json({ success: false, error: "Jobfair not found" });
    }

    res.json({
      success: true,
      message: "Jobfair info updated successfully",
      data: updatedjobfair,
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
  showtraining,
  updateJobfair,
  deletedtraining,
};
