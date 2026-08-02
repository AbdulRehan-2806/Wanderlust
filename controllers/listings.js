const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.index = async (req, res) => {
    let filter = {};
    if(req.query.category){
        filter.category = req.query.category;
    }
    if(req.query.search){
        filter.$or = [
            {
                title: {
                    $regex: req.query.search,
                    $options: "i"
                }
            },
            {
                location: {
                    $regex: req.query.search,
                    $options: "i"
                }
            },
            {
                country: {
                    $regex: req.query.search,
                    $options: "i"
                }
            }
        ];
    }
    const allListings = await Listing.find(filter);
    res.render("listings/index",{allListings, search: req.query.search, category: req.query.category});
};

module.exports.searchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === "") {
            return res.json({ suggestions: [] });
        }

        const suggestions = await Listing.aggregate([
            {
                $match: {
                    $or: [
                        { location: { $regex: q, $options: "i" } },
                        { country: { $regex: q, $options: "i" } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    locations: { $addToSet: "$location" },
                    countries: { $addToSet: "$country" },
                }
            }
        ]);

        let allSuggestions = [];
        if (suggestions.length > 0) {
            allSuggestions = [...suggestions[0].locations, ...suggestions[0].countries];
        }

        const filteredSuggestions = allSuggestions
            .filter(item => item.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 5);

        res.json({ suggestions: filteredSuggestions });
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            model: "Review",
            populate: {
                path: "author",
                model: "User"
            }
        })
        .populate("owner")
        .populate({
            path: "bookings",
            model: "Booking",
            populate: {
                path: "guest",
                model: "User"
            }
        });
    if(!listing){
        req.flash("error" , "Listing you requested for doesnot exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show",{listing});
};

module.exports.createListing = async (req,res,next)=>{
       let url = req.file.path;
       let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        await newListing.save();
        req.user.listings.push(newListing._id);
        await req.user.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing you requested for doesnot exists!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("listings/edit",{listing , originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.getMaxGuests = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id, "maxGuests");
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ maxGuests: listing.maxGuests });
};