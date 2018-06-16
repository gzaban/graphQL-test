const mongoose = require("mongoose");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const Author = mongoose.model("author");
const Comic = mongoose.model("comic");

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    comic: {
      type: new GraphQLList(require("./comic_type")),
      resolve(parentValue) {
	      console.log(parentValue);
        return Comic.findById(parentValue)
          .populate("comic")
          .then(author => {

            return author.comic;
          });
      }
    }
  })
});

module.exports = AuthorType;
