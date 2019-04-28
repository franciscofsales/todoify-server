import { Document, model, Model, Schema } from 'mongoose';
import { ICategory } from '../interfaces/category';

export interface ICategoryModel extends ICategory, Document {}

const Category: Schema = new Schema({
  name: String,
  icon: String,
});

const CategoryModel: Model<ICategoryModel> = model<ICategoryModel>('Category', Category);

export default CategoryModel;
