const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComicSchema = new Schema({
  title: { type: String },
  content: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  authors: [
    {
      type: Schema.Types.ObjectId,
      ref: "author"
    }
  ],
  heroes: [
    {
      type: Schema.Types.ObjectId,
      ref: "hero"
    }
  ]
});

ComicSchema.statics.addAuthor = function(id, firstName, lastName) {
  const Author = mongoose.model("author");

  return this.findById(id).then(comic => {
    const author = new Author({ firstName, lastName, comic });
    comic.authors.push(author);
    return Promise.all([author.save(), comic.save()]).then(([comic]) => comic);
  });
};

ComicSchema.statics.addHero = function(id, name) {
  const Hero = mongoose.model("hero");

  return this.findById(id).then(comic => {
    const hero = new Hero({ name, comic });
    comic.heroes.push(hero);
    return Promise.all([hero.save(), comic.save()]).then(([comic]) => comic);
  });
};

ComicSchema.statics.findHeroes = function(id) {
  return this.findById(id)
    .populate("heroes")
    .then(comic => comic.heroes);
};

ComicSchema.statics.findAuthors = function(id) {
  return this.findById(id)
    .populate("authors")
    .then(comic => comic.authors);
};

mongoose.model("comic", ComicSchema);
