const graphql = require("graphql");
const axios = require("axios");
const GraphQLJSON = require("graphql-type-json");

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
    // kpis: { type: new GraphQLList(GraphQLObjectType) },
    accountCapabilities: { type: GraphQLJSON },
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

const FacilityType = new GraphQLObjectType({
  name: "facility",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/accounts/?facilityId=${parentValue.id}`)
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
    // kpis: { type: new GraphQLList(GraphQLObjectType) },
    country: { type: GraphQLString },
    facility: {
      type: FacilityType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/facilities/${parentValue.facilityId}`)
          .then(res => res.data);
      }
    },
    demandResponseSiteData: { type: GraphQLJSON },
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
    vars: {
      type: new GraphQLList(VarType),
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/vars`).then(resp => resp.data);
      }
    },
    facilities: {
      type: new GraphQLList(FacilityType),
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/facilities`)
          .then(resp => resp.data);
      }
    },
    facility: {
      type: FacilityType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/facilities/${args.id}`)
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
    addFacility: {
      type: FacilityType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { name }) {
        return axios
          .post("http://localhost:3000/facilities", { name })
          .then(res => res.data);
      }
    },
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
