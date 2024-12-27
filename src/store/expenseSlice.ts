import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  tripId: string;
}

interface ExpenseState {
  [tripId: string]: Expense[];
}

const initialState: ExpenseState = {};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      const { tripId } = action.payload;
      if (!state[tripId]) {
        state[tripId] = [];
      }
      state[tripId].push(action.payload);
    },
    deleteExpense: (state, action: PayloadAction<{tripId: string, expenseId:string}>) =>{
      const {tripId, expenseId} = action.payload;
      if(state[tripId]){
        state[tripId] = state[tripId].filter(expense => expense.id != expenseId);
      }
    }
  }
});

export const { addExpense, deleteExpense} = expenseSlice.actions;
export default expenseSlice.reducer;
