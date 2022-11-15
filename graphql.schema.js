const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  graphql,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const axios = require("axios");

const dbUrl = "http://localhost:3000";

const Company = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    people: {
      type: GraphQLList(User),
      resolve(parent, args) {
        return axios
          .get(dbUrl + `/companies/${parent.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: Company,
      resolve(parent, args) {
        return axios
          .get(dbUrl + `/companies/${parent.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

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

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: User,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .post(dbUrl + "/users", {
            firstName: args.firstName,
            lastName: args.lastName,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
