const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  category: {
    type: [String],
    enum: [
      // "Trending",
      "Amazing Pools",
      "Arctic",
      "Beach",
      "Bungalows",
      "Camping",
      "Castles",
      "Countryside",
      "Farms",
      "Houses",
      "Islands",
      "Mountains",
      "Nature",
      "Rooms",
      "Vineyards",
    ],
    required: true
  },

  //add tto trending automatically
  isTrending: {
    type: Boolean,
    default: true,
  },

});

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;