export interface ITodo {
  body: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITodoCreate {
  body: string;
  categoryId: string;
  userId: string;
}
