import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice';
import expenseReducer from './expenseSlice';

export const store = configureStore({
  reducer: {
    trips: tripReducer,
    expenses: expenseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
