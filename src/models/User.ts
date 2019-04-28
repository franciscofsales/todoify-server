import { Document, model, Model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

export interface IUserModel extends IUser, Document {}

const User: Schema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, select: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel: Model<IUserModel> = model<IUserModel>('User', User);
export default UserModel;
