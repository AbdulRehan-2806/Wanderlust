const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
        let {error} = listingSchema.validate(req.body);
        if(error)
        {
            errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
}

module.exports.validateReview = (req,res,next)=>{
        let {error} = reviewSchema.validate(req.body);
        if(error)
        {
            errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateDatesNull = (req, res, next) => {
    let {id} = req.params;
    let {checkin, checkout, guests} = req.body;
    if(checkin == '' || checkout == "Add date"){
        req.flash("error", "Please select all the fields to continue");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isLoggedInToBook = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl.replace("/bookings", "");
        req.flash("error", "You must be logged in to reserve a booking");
        return res.redirect("/login");
    }
    next();
};

module.exports.isLoggedInToCancel = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = "/listings";
        req.flash("error", "You must be logged in to reserve a booking");
        return res.redirect("/login");
    }
    next();
};

module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to change password");
    res.redirect("/login");
};