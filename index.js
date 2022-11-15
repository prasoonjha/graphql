const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./graphql.schema");
const app = express();

app.use(
  "/graphql",
  expressGraphQL.graphqlHTTP({
    graphiql: true,
    schema,
  })
);
app.listen(4000, () => {
  console.log("Listening on port 4000");
});
