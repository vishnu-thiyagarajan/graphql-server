const userResolvers = require("./users");
const messageResolvers = require("./messages");
const channelResolvers = require("./channels");

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt,
  },
  User: {
    createdAt: (parent) => parent.createdAt,
  },
  Channel: {
    createdAt: (parent) => parent.createdAt,
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
    ...channelResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
    ...channelResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
