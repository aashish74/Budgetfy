import { configureStore } from '@reduxjs/toolkit';
import tripReducer from './tripSlice';
import expenseReducer from './expenseSlice';
import currencySlice from './currencySlice';
import userSlice from './userSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    trips: tripReducer,
    expenses: expenseReducer,
    currency: currencySlice,
    user: userSlice,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
