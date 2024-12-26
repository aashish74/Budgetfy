import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Trip {
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
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push(action.payload);
    },
  },
});

export const { addTrip } = tripSlice.actions;
export default tripSlice.reducer;
