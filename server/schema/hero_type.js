const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLString } = graphql;

const Hero = mongoose.model("hero");

const HeroType = new GraphQLObjectType({
  name: "HeroType",
  fields: () => ({
    id: { type: GraphQLID },
    likes: { type: GraphQLInt },
    name: { type: GraphQLString },
    comic: {
      type: require("./comic_type"),
      resolve(parentValue) {
        return Hero.findById(parentValue)
          .populate("comic")
          .then(hero => {
            console.log("hero", hero);
            return hero.comic;
          });
      }
    }
  })
});

module.exports = HeroType;
