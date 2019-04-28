import { Document, model, Model, Schema, Types } from 'mongoose';
import { ITodo } from '../interfaces/todo';

interface ITodoModel extends ITodo, Document {}

const Todo: Schema = new Schema({
  body: String,
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  categoryId: {
    type: Types.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const TodoModel: Model<ITodoModel> = model<ITodoModel>('Todo', Todo);

export default TodoModel;
