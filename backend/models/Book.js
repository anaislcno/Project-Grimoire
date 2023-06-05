// const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: { type: String, require: true },
  title: { type: String, require: true },
  author: { type: String, require: true },
  imageUrl: { type: String, require: true },
  year: { type: Number, require: true },
  genre: { type: Number, require: true },
  rating: [
    {
      userId: { type: String, require: true },
      genre: { type: Number, require: true },
    },
  ],
  averageRating: { type: Number, require: false },
});

// module.exports = mongoose.model("Thing", thingSchema);
