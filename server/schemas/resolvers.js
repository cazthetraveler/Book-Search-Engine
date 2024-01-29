const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_, { username, id }) => {
      try {
        const foundUser = await User.findOne({
          $or: [{ _id: id }, { username }],
        });
        if (!foundUser) {
          throw new Error("User not found!!");
        }

        return foundUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { user, body }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new Error("User not found!!");
        }

        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    removeBook: async (_, { user, bookId }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          return new Error("User not found!");
        }

        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
