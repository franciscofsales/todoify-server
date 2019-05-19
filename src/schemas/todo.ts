import { ITodo, ITodoCreate, ITodoUpdateStatus } from '../interfaces/todo';
import { Category, Todo, User } from '../models';
import { retrieveUser } from '../utils/authMiddleware';

export const typeDef = `
  extend type Query {
    todo(id: ID): Todo
    todos: [Todo]
    dailyTodos: [Todo]
  }

  extend type Mutation {
    createTodo(input: CreateTodoInput!): Todo
    updateTodo(input: UpdateTodoStatusInput!): Todo
  }
  
  input UpdateTodoStatusInput {
     todoId: String!
     status: String!
  }
  
  input CreateTodoInput {
     body: String!
     categoryId: String!
  }

  type Todo {
    _id: ObjectID!
    body: String
    dueDate: String
    user: User
    category: Category
    status: String
  }
`;

export const resolvers = {
  Query: {
    todo(root, { id = '' }, context) {
      const user = retrieveUser(context);
      return Todo.findOne({ _id: id, userId: user._id });
    },
    todos(root, {}, context) {
      const user = retrieveUser(context);
      return Todo.find({ userId: user._id });
    },
    async dailyTodos(root, {}, context) {
      const user = retrieveUser(context);
      const list = await Todo.find({
        $and: [
          { userId: user._id },
          { status: 'TODO' },
          {
            dueDate: {
              $gte: new Date().setHours(0, 0, 0, 0),
            },
          },
          {
            dueDate: {
              $lt: new Date().setHours(23, 59, 59, 999),
            },
          },
        ],
      });
      return Todo.find({
        $and: [
          { userId: user._id },
          { status: 'TODO' },
          {
            dueDate: {
              $gte: new Date().setHours(0, 0, 0, 0),
            },
          },
          {
            dueDate: {
              $lt: new Date().setHours(23, 59, 59, 999),
            },
          },
        ],
      });
    },
  },
  Mutation: {
    async createTodo(root, args: ITodoCreate, context): Promise<ITodo> {
      const user = retrieveUser(context);
      const {
        input: { body, categoryId },
      } = args;
      return Todo.create({ body, categoryId, userId: user._id });
    },
    async updateTodo(root, args: ITodoUpdateStatus, context): Promise<ITodo> {
      const user = retrieveUser(context);
      const {
        input: { todoId, status },
      } = args;
      const todo = await Todo.findById(todoId);
      if (todo.userId.toString() !== user._id.toString()) {
        return null;
      }
      todo.status = status;
      return todo.save();
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
