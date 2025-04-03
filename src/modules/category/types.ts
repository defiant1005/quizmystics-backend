export interface ICategory {
  id: number;
  title: string;
}

export interface ICategoryCreate extends Omit<ICategory, 'id'> {}
