const Listing = require("../models/listing");

const Review = require("../models/review");

module.exports.createReview = async (req,res)=>{

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    newReview.listing = listing._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.user.reviews.push(newReview._id);
    await req.user.save();
    req.flash("success" , "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewId}});
    req.flash("success" , "Review Deleted!");
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

};