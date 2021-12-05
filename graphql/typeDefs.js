const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    email: String
    token: String
    latestMessage: Message
    createdAt: String!
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    channel: Boolean
    createdAt: String!
  }
  type Channel {
    uuid: String!
    channelname: String!
    members: [String]!
    createdAt: String!
    latestMessage: Message
  }
  type Query {
    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String, chnlID: String): [Message]!
    getChannels: [Channel]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String, chnlID: String, content: String!): Message!
    addChannel(channelname: String!, members: [String]!): Channel!
  }
  type Subscription {
    newMessage: Message!
  }
`;
