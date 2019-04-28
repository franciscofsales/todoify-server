import { ITodo, ITodoCreate } from '../interfaces/todo';
import { Category, Todo, User } from '../models';

export const typeDef = `
  extend type Query {
    todo(id: ID): Todo
    todos: [Todo]
  }

  extend type Mutation {
    createTodo(body: String!, userId: ID!, categoryId: ID!): Todo
  }

  type Todo {
    _id: ObjectID!
    body: String
    user: User
    category: Category
  }
`;

export const resolvers = {
  Query: {
    todo(root, { id = '' }) {
      return Todo.findOne({ _id: id });
    },
    todos(root, {}) {
      return Todo.find({});
    },
  },
  Mutation: {
    async createTodo(root, args: ITodoCreate): Promise<ITodo> {
      const { body, categoryId, userId } = args;
      return Todo.create({ body, categoryId, userId });
    },
  },
  Todo: {
    user(todo) {
      return User.findById(todo.userId);
    },
    category(todo) {
      return Category.findById(todo.categoryId);
    },
  },
};
