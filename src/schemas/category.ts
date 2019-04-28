import { ICategory, ICategoryCreate } from '../interfaces/category';
import { Category } from '../models';
import { ICategoryModel } from '../models/Category';

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
    icon: String
  }
`;

export const resolvers = {
  Query: {
    async category(root, { id = '' }): Promise<ICategory> {
      const category = await Category.findOne({ _id: id });
      return category.toObject();
    },
    async categories(root, {}): Promise<ICategoryModel[]> {
      const categories = await Category.find({});
      return categories.map(category => category.toObject());
    },
  },
  Mutation: {
    async createCategory(root, args: ICategoryCreate): Promise<ICategory> {
      const { name, icon } = args;
      const category = await Category.create({ name, icon });
      return category;
    },
  },
};
