const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HeroSchema = new Schema({
  comic: {
    type: Schema.Types.ObjectId,
    ref: "comic"
  },
  likes: { type: Number, default: 0 },
  name: { type: String }
});

HeroSchema.statics.like = function(id) {
  const Hero = mongoose.model("hero");

  return Hero.findById(id).then(hero => {
    ++hero.likes;
    return hero.save();
  });
};

mongoose.model("hero", HeroSchema);
