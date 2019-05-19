import { IUserAuth, IUserAuthResponse, IUserSignUp } from '../interfaces/user';
import { User } from '../models';
import { generateTokens } from '../utils/jwt';
import { authenticatePassword, hashPassword } from '../utils/password';

export const typeDef = `
  extend type Query {
    user(id: ID): User
  }

  extend type Mutation {
    signUp(input: SignUpInput!): UserAuth 
    auth(input: AuthInput!): UserAuth
  }
  
  input AuthInput {
     email: String!
     password: String!
  }
  input SignUpInput {
     email: String!
     password: String!
     name: String!
  }
  
  type UserAuth {
    access: String!
    refresh: String!
    userId: ObjectID!
    userName: String!
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
      const {
        input: { name, email, password },
      } = args;
      const hashed = hashPassword(password);
      const user = await User.create({
        name,
        email,
        password: hashed,
      });
      const tokens = await generateTokens({ _id: user._id, name, email });
      return { ...tokens, userId: user._id, userName: user.name };
    },
    async auth(root, args: IUserAuth): Promise<IUserAuthResponse> {
      const {
        input: { email, password },
      } = args;
      const user = await User.findOne({ email }).select('+password');
      const validatedPassword = authenticatePassword(password, user.password);
      if (!validatedPassword) {
        throw new Error('Invalid username or password');
      }
      const tokens = await generateTokens({ name: user.name, email: user.email, _id: user._id });
      return { userId: user._id, userName: user.name, ...tokens };
    },
  },
};
