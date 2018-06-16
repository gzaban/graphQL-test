const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const ComicType = require("./comic_type");
const HeroType = require("./hero_type");
const AuthorType = require("./author_type");
const Hero = mongoose.model("hero");
const Author = mongoose.model("author");
const Comic = mongoose.model("comic");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    comicsList: {
      type: new GraphQLList(ComicType),
      resolve() {
        return Comic.find({});
      }
    },
    comics: {
      type: ComicType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        console.log("comics", id);
        return Comic.findById(id);
      }
    },
    heroesList: {
      type: new GraphQLList(HeroType),
      resolve() {
        return Hero.find({});
      }
    },
    authorsList: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return Author.find({});
      }
    },
    hero: {
      type: HeroType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Hero.findById(id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Author.findById(id);
      }
    }
  })
});

module.exports = RootQuery;
