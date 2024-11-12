const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();

const AuthController = require("../controller/AuthController");
const authenticate = require("../middleware/authenticate");

router.post("/userRegister", AuthController.userRegister);
router.post("/logout", AuthController.logout);
router.post("/search", AuthController.search);
router.post("/login", AuthController.login);

module.exports = router;
