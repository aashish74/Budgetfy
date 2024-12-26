import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  tripId?: string;
}

interface ExpenseState {
  expenses: Record<string, Expense[]>;  // Key is tripId, value is array of expenses
}

const initialState: ExpenseState = {
  expenses: {},
};

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: {} as { [key: string]: Expense[] }
  },
  reducers: {
    addExpense: (state, action: PayloadAction<{ tripId: string; expense: Expense }>) => {
      const { tripId, expense } = action.payload;
      if (!state.expenses[tripId]) {
        state.expenses[tripId] = [];
      }
      state.expenses[tripId].push(expense);
    }
  }
});

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer;
