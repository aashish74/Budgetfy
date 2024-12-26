import { createSelector } from 'reselect';
import { RootState } from './store';

export const selectExpensesByTripId = (tripId: string) =>
    createSelector(
        (state: RootState) => state.expenses.expenses[tripId],
        (expenses) => expenses || []
    );


// By using createSelector, the selector will now return a memoized result, 
// preventing unnecessary re-renders when the same parameters are passed.
