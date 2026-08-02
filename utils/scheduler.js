const cron = require("node-cron");
const Booking = require("../models/booking.js");

const updateCompletedBookings = async () => {
    console.log('Running scheduled job: Checking for completed bookings...');
    try {
        const now = new Date();
        const result = await Booking.updateMany(
            {
                status: "confirmed",
                checkOut: { $lt: now }
            },
            {
                $set: { status: "completed" }
            }
        );
        console.log(`Marked ${result.modifiedCount} booking(s) as completed`);
    } catch (error) {
        console.error('Error during scheduled booking update:', error);
    }
};

const initScheduledJobs = () => {
   // Run once immediately on startup.
    updateCompletedBookings();

    // Then runs once a day at midnight UTC
    cron.schedule("0 0 * * *", updateCompletedBookings, {
        scheduled: true,
        timezone: "UTC"
    });
};

module.exports = { initScheduledJobs };