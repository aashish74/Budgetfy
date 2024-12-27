import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Trip {
  id: string;
  place: string;
  country: string;
}

interface TripState {
  trips: Trip[];
}

const initialState: TripState = {
  trips: [],
};

export const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Omit<Trip, 'id'>>) => {
      state.trips.push({
        ...action.payload,
        id: Date.now().toString()
      });
    },
  },
});

export const { addTrip } = tripSlice.actions;
export default tripSlice.reducer;
