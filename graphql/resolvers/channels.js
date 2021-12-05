const { UserInputError, AuthenticationError } = require("apollo-server");
const { Message, Channel } = require("../../models");

module.exports = {
  Query: {
    getChannels: (_, __, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        let channels = Channel.filter((obj) =>
          obj.members.includes(user.username)
        );

        const ChannelNames = Channel.map((item) => item["channelname"]);

        const allUserMessages = Message.filter(
          (obj) =>
            ChannelNames.includes(obj.from) || ChannelNames.includes(obj.to)
        );

        channels = channels.map((channel) => {
          const latestMessage = allUserMessages
            .reverse()
            .find(
              (m) =>
                m.from === channel.Channelname || m.to === channel.Channelname
            );
          channel.latestMessage = latestMessage;
          return channel;
        });

        return channels;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    addChannel: (_, args) => {
      let { channelname, members } = args;
      let errors = {};
      try {
        const ChannelNames = Channel.map((item) => item["channelname"]);
        if (members.length <= 2) errors.members = "members must be more than 2";
        if (channelname.trim() === "")
          errors.channelname = "channel name must not be empty";
        if (ChannelNames.includes(channelname))
          errors.channelname = "Channel Name already taken";
        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        const id = Channel.length;
        const chl = {
          createdAt: new Date(Date.now()).toISOString(),
          uuid: id,
          channelname,
          members,
        };
        Channel.push(chl);
        return chl;
      } catch (err) {
        console.log(err);
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
