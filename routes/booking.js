const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedInToBook, isLoggedInToCancel, validateDatesNull } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");


router.get("/unavailable", wrapAsync(bookingController.sendUnavailableDates));
router.post("/", isLoggedInToBook, validateDatesNull, wrapAsync(bookingController.createBooking));

router.get("/:bookingId", isLoggedInToBook, wrapAsync(bookingController.showBooking));

router.route("/:bookingId/delete")
    .get(isLoggedInToCancel, wrapAsync(bookingController.renderCancelPage))
    .delete(isLoggedInToCancel, wrapAsync(bookingController.cancelBooking));

module.exports = router;