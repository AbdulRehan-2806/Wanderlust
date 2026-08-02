const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");

module.exports.createBooking = async (req, res) => {
    let { id } = req.params;
    let { checkin, checkout, guests } = req.body;

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let checkInDate = new Date(checkin);
    let checkOutDate = new Date(checkout);

    if (checkInDate >= checkOutDate) {
        req.flash("error", "Check-out date must be after check-in date");
        return res.redirect(`/listings/${id}`);
    }

    if (Number(guests) > listing.maxGuests) {
        req.flash("error", `This listing only allows up to ${listing.maxGuests} guests`);
        return res.redirect(`/listings/${id}`);
    }

    let isAvailable = await Booking.checkAvailability(id, checkInDate, checkOutDate);
    if (!isAvailable) {
        req.flash("error", "These dates are not available. Please pick different dates.");
        return res.redirect(`/listings/${id}`);
    }

    let newBooking = new Booking({
        listing: id,
        guest: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests),
        status: "confirmed",
    });
    newBooking.totalPrice = newBooking.calculateTotalPrice(listing.price);

    await newBooking.save();

    listing.bookings.push(newBooking._id);
    await listing.save();

    let user = await User.findById(req.user._id);
    user.bookings.push(newBooking._id);
    await user.save();

    req.flash("success", "Booking confirmed!");
    res.redirect(`/listings/${id}/bookings/${newBooking._id}`);
};

module.exports.showBooking = async (req, res) => {
    let { id, bookingId } = req.params;
    let booking = await Booking.findById(bookingId).populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect(`/listings/${id}`);
    }
    res.render("bookings/booking.ejs", { booking });
};

module.exports.renderCancelPage = async (req, res) => {
    let { id, bookingId } = req.params;
    let booking = await Booking.findById(bookingId).populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect(`/listings/${id}`);
    }
    res.render("bookings/cancellation.ejs", { booking, id });
};

module.exports.cancelBooking = async (req, res) => {
    let { id, bookingId } = req.params;
    let booking = await Booking.findById(bookingId);

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!booking.guest.equals(req.user._id)) {
        req.flash("error", "You are not permitted to cancel this booking");
        return res.redirect(`/listings/${id}`);
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled");
    res.redirect(`/listings/${id}`);
};

module.exports.sendUnavailableDates = async (req, res) => {
    const { id } = req.params;
    const bookings = await Booking.find(
        { listing: id, status: "confirmed" },
        "checkIn checkOut"
    );
    res.json(bookings);
};