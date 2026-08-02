const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthenticated } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { renderProfile, editProfile, passwordCheck, changePassword } = require("../controllers/profiles.js");

router.get("/", isLoggedIn, wrapAsync(renderProfile));
router.post("/edit", isLoggedIn, wrapAsync(editProfile));
router.post("/password-check", isAuthenticated, passwordCheck);
router.post("/change-password", isAuthenticated, changePassword);

module.exports = router;