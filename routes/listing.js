const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage }); // Configure multer to save files to 'uploads/' directory


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );
  
// New Route :(Create new listing Route)
router.get("/new", 
  isLoggedIn, 
  listingController.renderNewForm
);

// TRENDING LISTINGS
router.get("/trending", wrapAsync(async (req, res) => {
  const listings = await Listing.find({ isTrending: true });
  res.render("listings/index.ejs", { listings });
}));


router
  .route("/:id")
  .get(
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing)
  )
  .delete( 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.destroyListing)
  );


// Edit Route
router.get("/:id/edit", 
  isLoggedIn, 
  isOwner, 
  wrapAsync(listingController.renderEditForm)
);





// index route :
// router.get("/", wrapAsync(listingController.index)); // index is inside controllers/listings.js


// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

// Create Route :
// router.post(
//   "/", 
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );



// Update Route
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing, 
//   wrapAsync(listingController.updateListing)
// );

// Delete Route
// router


module.exports = router;