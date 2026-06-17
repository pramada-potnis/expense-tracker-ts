// A basic type alias
//type Category = string;

export enum Category {
  Food = 'Food',
  Transport = 'Transport',
  Housing = 'Housing',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Other = 'Other',
}

// An interface describes the shape of an object
export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: Category;
  note?: string;          // ? means optional
}