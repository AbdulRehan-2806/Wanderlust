const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending",
    },
});

// Speeds up queries like "find bookings for this listing between these dates"
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ status: 1 });

// A "static" method — called as Booking.checkAvailability(...)
// Checks if any CONFIRMED booking on this listing overlaps with the requested dates
bookingSchema.statics.checkAvailability = async function (listingId, checkIn, checkOut) {
    const query = {
        listing: listingId,
        status: { $in: ["confirmed"] },
        $or: [
            { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
            { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
            { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } }
        ]
    };
    const conflictingBooking = await this.findOne(query);
    return !conflictingBooking; // true = available, false = someone already booked those dates
};

// A "method" — called on a single booking instance, e.g. newBooking.calculateTotalPrice(price)
bookingSchema.methods.calculateTotalPrice = function (pricePerNight) {
    const nights = Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
    return nights * pricePerNight;
};

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;