import { ICategory, ICategoryCreate } from '../interfaces/category';
import { Category, Todo } from '../models';
import { ICategoryModel } from '../models/Category';
import { retrieveUser } from '../utils/authMiddleware';

export const typeDef = `
  scalar ObjectID
  extend type Query {
    category(id: ID): Category
    categories: [Category]
  }

  extend type Mutation {
    createCategory(name: String!, icon: String!): Category
  }

  type Category {
    _id: ObjectID!
    name: String,
    icon: Int,
    tasksRemaining: Int,
    taskCompletion: Float
    todos: [Todo]
  }
`;

export const resolvers = {
  Query: {
    async category(root, { id = '' }, context): Promise<ICategory> {
      const user = retrieveUser(context);
      const category = await Category.findOne({
        _id: id,
        $or: [
          {
            userId: user._id,
          },
          { userId: { $exists: false } },
        ],
      });
      const todos = await Todo.find({
        userId: user._id,
        categoryId: id,
      });
      return { ...category.toObject(), todos };
    },
    async categories(root, args, context): Promise<ICategoryModel[]> {
      const user = retrieveUser(context);
      const categoriesRaw = await Category.find({
        $or: [
          {
            userId: user._id,
          },
          { userId: { $exists: false } },
        ],
      });
      const categories = [];
      await Promise.all(
        categoriesRaw.map(async category => {
          const todos = await Todo.count({
            categoryId: category._id,
            userId: user._id,
          });
          const done = await Todo.count({
            categoryId: category._id,
            $or: [
              {
                status: 'COMPLETED',
              },
              { status: 'ARCHIVED' },
            ],
            userId: user._id,
          });
          categories.push({
            ...category.toObject(),
            tasksRemaining: todos - done || 0,
            taskCompletion: todos !== 0 ? done / todos : 1,
          });
        })
      );
      return categories;
    },
  },
  Mutation: {
    async createCategory(root, args: ICategoryCreate, context): Promise<ICategory> {
      const user = retrieveUser(context);
      const { name, icon } = args;
      const category = await Category.create({ name, icon, userId: user._id });
      return category;
    },
  },
};
