import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice';
import expenseReducer from './expenseSlice';
import currencySlice  from './currencySlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    trips: tripReducer,
    expenses: expenseReducer,
    currency: currencySlice,
    user: userSlice
  },
});

export type RootState = ReturnType<typeof store.getS