export interface ITodo {
  body: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
}

export interface ITodoCreate {
  input: {
    body: string;
    categoryId: string;
    userId: string;
  };
}

export interface ITodoUpdateStatus {
  input: {
    todoId: string;
    status: string;
  };
}
