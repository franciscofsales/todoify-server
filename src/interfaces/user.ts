export interface IUser {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface IUserAuthResponse {
  userId: string;
  access: string;
  refresh: string;
}

export interface IUserAuthInterface {
  _id: string;
  name: string;
  email: string;
}
