const { ApolloServer } = require("apollo-server");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
