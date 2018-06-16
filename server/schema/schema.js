const graphql = require('graphql');
const { GraphQLSchema } = graphql;
require('../models/index');
const RootQueryType = require('./root_query_type');
const mutations = require('./mutations');

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations
});
