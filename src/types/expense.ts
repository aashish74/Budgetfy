export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: string;
    description: string;
    tripId: string;
    userId: string;
    date?: Date;
    createdAt?: any;
  }