const Listing = require('../models/listing');


module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  // CATEGORY FILTER
  if (category) {
    filter.category = category;
  }

  // LOCATION SEARCH (case-insensitive)
  if (search) {
    filter.location = { $regex: search, $options: "i" };
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index.ejs", {
    allListings,
    selectCategory: category || "Trending",
    search: search || ""
  });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews", 
    populate: { 
      path: "author" 
    },
  })
  .populate("owner");
  if(!listing) {
    req.flash("error", "Listing u requested for does not exist!");
    return res.redirect("/listings");
  }  
  console.log(listing);
  listing.reviews = listing.reviews.filter(r => r.author);

  res.render("listings/show.ejs", {
    listing,
    currUser: req.user,
    mapToken: process.env.MAP_TOKEN
  });

};


module.exports.createListing = async (req, res, next) => {
    // let {title, description, imageUrl, price, location, country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing u requested for does not exist!");
    return res.redirect("/listings");
  }  

  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload/", "/upload/w_250/"); // Resize for display
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== 'undefined') {
      // If a new image is uploaded, update the image field
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};