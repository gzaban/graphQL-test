const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const HeroType = require('./hero_type');
const AuthorType = require('./author_type');
const Comic = mongoose.model('comic');

const ComicType = new GraphQLObjectType({
  name: "ComicType",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    heroes: {
      type: new GraphQLList(HeroType),
      resolve(parentValue) {
        return Comic.findHeroes(parentValue.id);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parentValue) {
        return Comic.findAuthors(parentValue.id);
      }
    }
  })
});

module.exports = ComicType;
