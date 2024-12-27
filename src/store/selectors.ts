import { createSelector } from 'reselect';
import { RootState } from './store';

export const selectExpensesByTripId = (tripId: string) => (state: RootState) => {
  return state.expenses[tripId] || [];
};


// By using createSelector, the selector will now return a memoized result, 
// preventing unnecessary re-renders when the same parameters are passed.
