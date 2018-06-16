const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  comic: {
    type: Schema.Types.ObjectId,
    ref: "comic"
  },
  firstName: { type: String },
  lastName: { type: String }
});

mongoose.model("author", AuthorSchema);
