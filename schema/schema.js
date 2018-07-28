const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} = graphql;

const VarType = new GraphQLObjectType({
  name: "vars",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    industryDescription: { type: GraphQLString },
    sectorDescription: { type: GraphQLString },
    erpId: { type: GraphQLString },
    kpis: { type: GraphQLList(GraphQLObjectType) },
    accountCapabilities: { type: GraphQLObjectType },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/vars/${parentValue.id}/accounts`)
          .then(res => res.data);
      }
    }
  })
});

const AccountType = new GraphQLObjectType({
  name: "Account",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    highestAlertSeverity: { type: GraphQLString },
    status: { type: GraphQLString },
    currency: { type: GraphQLString },
    currencySymbol: { type: GraphQLString },
    address: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    tempUnits: { type: GraphQLString },
    tempUnitsSymbol: { type: GraphQLString },
    kpis: { type: GraphQLList(GraphQLObjectType) },
    country: { type: GraphQLString },
    facility: { type: GraphQLObjectType },
    demandResponseSiteData: { type: GraphQLObjectType },
    var: {
      type: VarType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/vars/${parentValue.varId}`)
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    account: {
      type: AccountType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/accounts/${args.id}`)
          .then(resp => resp.data);
      }
    },
    var: {
      type: VarType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/vars/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAccount: {
      type: AccountType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        varId: { type: GraphQLString }
      },
      resolve(parentValue, { name, varId }) {
        return axios
          .post("http://localhost:3000/accounts", { name, varId })
          .then(res => res.data);
      }
    },
    deleteAccount: {
      type: AccountType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/accounts/${id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  mutation,
  query: RootQuery
});
