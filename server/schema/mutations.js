const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require("mongoose");
const Comic = mongoose.model("comic");
const Hero = mongoose.model("hero");
const ComicType = require("./comic_type");
const HeroType = require("./hero_type");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addComic: {
      type: ComicType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString }
      },
      resolve(parentValue, { title, content }) {
        return new Comic({ title, content }).save();
      }
    },
    addAuthorToComic: {
      type: ComicType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        comicId: { type: GraphQLID }
      },
      resolve(parentValue, { firstName, lastName, comicId }) {
        return Comic.addAuthor(comicId, firstName, lastName);
      }
    },
    addHeroToComic: {
      type: ComicType,
      args: {
        name: { type: GraphQLString },
        comicId: { type: GraphQLID }
      },
      resolve(parentValue, { name, comicId }) {
        return Comic.addHero(comicId, name);
      }
    },
    likeHero: {
      type: HeroType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Hero.like(id);
      }
    },
    deleteComic: {
      type: ComicType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Comic.remove({ _id: id });
      }
    }
  }
});

module.exports = mutation;
