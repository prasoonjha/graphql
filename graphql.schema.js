const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  graphql,
  GraphQLInt,
} = require("graphql");
const axios = require("axios");

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const Company = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});
const dbUrl = "http://localhost:3000";
const RootQuery = new GraphQLObjectType({
  name: "Root",
  fields: {
    user: {
      type: User,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios.get(dbUrl + `/users/${args.id}`).then((res) => res.data);
      },
    },
    company: {
      type: Company,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(dbUrl + `/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
