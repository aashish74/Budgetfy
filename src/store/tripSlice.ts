import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../types/trip';

interface TripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  loading: false,
  error: null
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    addTrip: (state, action: PayloadAction<Trip>) => {
      state.trips.push({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
    },
    setTrips: (state, action: PayloadAction<Trip[]>) => {
      state.trips = action.payload;
    },
    deleteTrip: (state, action: PayloadAction<string>) => {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
    }
  }
});

export const { addTrip, setTrips, deleteTrip } = tripSlice.actions;
export default tripSlice.reducer;
