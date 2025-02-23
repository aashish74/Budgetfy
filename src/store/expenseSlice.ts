import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../types/expense';

interface ExpenseState {
  [tripId: string]: Expense[];
}

const initialState: ExpenseState = {};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id' | 'createdAt'>>) => {
      const expense = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      if (!state[expense.tripId]) {
        state[expense.tripId] = [];
      }
      state[expense.tripId].push(expense);
    },
    deleteExpense: (state, action: PayloadAction<{ tripId: string; expenseId: string }>) => {
      const { tripId, expenseId } = action.payload;
      if (state[tripId]) {
        state[tripId] = state[tripId].filter(expense => expense.id !== expenseId);
      }
    },
    setTripExpenses: (state, action: PayloadAction<{ tripId: string; expenses: Expense[] }>) => {
      const { tripId, expenses } = action.payload;
      state[tripId] = expenses;
    }
  }
});

export const { addExpense, deleteExpense, setTripExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
