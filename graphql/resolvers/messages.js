const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");

const { User, Message, Channel } = require("../../models");

module.exports = {
  Query: {
    getMessages: (parent, { from, chnlID }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = User.find((obj) => obj.username === from);
        const channel = chnlID && Channel.find((obj) => obj.uuid == chnlID);

        if (
          !otherUser ||
          (channel && !channel?.members.includes(user.username))
        )
          throw new UserInputError("User not found");

        const usernames = chnlID
          ? channel.members
          : [user.username, otherUser.username];

        const messages = Message.filter((obj) =>
          chnlID
            ? obj.to == chnlID
            : usernames.includes(obj.from) && usernames.includes(obj.to)
        );

        return messages.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: (parent, { to, chnlID, content }, { user, pubsub }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const recipient = User.find((obj) => obj.username === to);

        if (chnlID === null && !recipient) {
          throw new UserInputError("User not found");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const id = Message.length;
        const msg = {
          createdAt: new Date(Date.now()).toISOString(),
          uuid: id,
          from: user.username,
          to: to || String(chnlID),
          channel: to ? false : true,
          content,
        };
        Message.push(msg);
        pubsub.publish("NEW_MESSAGE", { newMessage: msg });
        return msg;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          if (
            !newMessage.channel &&
            (newMessage.from === user.username ||
              newMessage.to === user.username)
          ) {
            return true;
          }
          const channel = Channel.find((obj) => obj.uuid == newMessage.to);
          if (newMessage.channel && channel.members.includes(user.username)) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
