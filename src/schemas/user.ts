import { IUserAuth, IUserAuthResponse, IUserSignUp } from '../interfaces/user';
import { User } from '../models';
import { generateTokens } from '../utils/jwt';
import { authenticatePassword, hashPassword } from '../utils/password';

export const typeDef = `
  extend type Query {
    user(id: ID): User
  }

  extend type Mutation {
    signUp(name: String!, email: String!, password: String!): UserAuth 
    auth(email: String!, password: String!): UserAuth
  }
  
  type UserAuth {
    access: String!
    refresh: String!
    userId: ObjectID!
  }

  type User {
    _id: ObjectID!
    name: String
    email: String
    password: String
  }
`;

export const resolvers = {
  Query: {
    async user(root, { id = '' }) {
      return User.findOne({ _id: id });
    },
  },
  Mutation: {
    async signUp(root, args: IUserSignUp): Promise<IUserAuthResponse> {
      const { name, email, password } = args;
      const hashed = hashPassword(password);
      const user = await User.create({
        name,
        email,
        password: hashed,
      });
      const tokens = await generateTokens({ _id: user._id, name, email });
      return { ...tokens, userId: user._id };
    },
    async auth(root, args: IUserAuth): Promise<IUserAuthResponse> {
      const { email, password } = args;
      const user = await User.findOne({ email }).select('+password');
      const validatedPassword = authenticatePassword(password, user.password);
      if (!validatedPassword) {
        throw new Error('Invalid username or password');
      }
      const tokens = await generateTokens({ name: user.name, email: user.email, _id: user._id });
      return { userId: user._id, ...tokens };
    },
  },
};
