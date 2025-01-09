import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addExpense as addExpenseToDb, getTripExpenses, deleteExpense as deleteExpenseFromDb } from '../config/expenseDB';
import { Expense } from '../types/expense';

interface ExpenseState {
  [tripId: string]: Expense[];
}

const initialState: ExpenseState = {};

// Helper function to safely serialize timestamps
const serializeExpense = (expense: any) => ({
  ...expense,
  createdAt: expense.createdAt?.seconds ? 
    new Date(expense.createdAt.seconds * 1000).toISOString() : 
    new Date().toISOString(),
  date: expense.date?.seconds ? 
    new Date(expense.date.seconds * 1000).toISOString() : 
    new Date().toISOString()
});

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData: any) => {
    try {
      const newExpense = await addExpenseToDb(expenseData);
      return serializeExpense(newExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }
);

export const fetchTripExpenses = createAsyncThunk(
  'expenses/fetchTripExpenses',
  async (tripId: string) => {
    const expenses = await getTripExpenses(tripId);
    return {
      tripId,
      expenses: expenses.map(expense => serializeExpense(expense))
    };
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ tripId, expenseId }: { tripId: string; expenseId: string }, { rejectWithValue }) => {
    try {
      await deleteExpenseFromDb(expenseId);
      return { tripId, expenseId };
    } catch (error) {
      console.error('Delete failed:', error);
      // Remove from Redux store even if Firebase fails
      return { tripId, expenseId };
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExpense.fulfilled, (state, action) => {
        const { tripId } = action.payload;
        if (!state[tripId]) {
          state[tripId] = [];
        }
        state[tripId].push(action.payload);
      })
      .addCase(fetchTripExpenses.fulfilled, (state, action) => {
        const { tripId, expenses } = action.payload;
        state[tripId] = expenses;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const { tripId, expenseId } = action.payload;
        if (state[tripId]) {
          state[tripId] = state[tripId].filter(expense => expense.id !== expenseId);
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        console.error('Delete expense failed:', action.error);
      });
  }
});

export default expenseSlice.reducer;
