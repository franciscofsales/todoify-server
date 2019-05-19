export interface IUser {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSignUp {
  input: {
    name: string;
    email: string;
    password: string;
  }
}

export interface IUserAuth {
  input: {
    email: string;
    password: string;
  }
}

export interface IUserAuthResponse {
  userId: string;
  access: string;
  refresh: string;
  userName: string;
}

export interface IUserAuthInterface {
  _id: string;
  name: string;
  email: string;
}
