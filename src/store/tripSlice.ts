import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addTrip, getUserTrips, deleteTrip } from '../config/firebaseDB';

interface Trip {
  id?: string;
  place: string;
  country: string;
  userId: string;
  createdAt?: any;
}

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

// Helper function to safely serialize timestamps
const serializeTrip = (trip: any) => ({
  ...trip,
  createdAt: trip.createdAt?.seconds ? 
    new Date(trip.createdAt.seconds * 1000).toISOString() : 
    new Date().toISOString()
});

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData: Omit<Trip, 'id' | 'createdAt'>) => {
    try {
      const newTrip = await addTrip(tripData);
      return serializeTrip(newTrip);
    } catch (error) {
      console.error('Error in createTrip:', error);
      throw error;
    }
  }
);

export const fetchUserTrips = createAsyncThunk(
  'trips/fetchUserTrips',
  async (userId: string) => {
    const trips = await getUserTrips(userId);
    return trips.map(trip => serializeTrip(trip));
  }
);

export const removeTrip = createAsyncThunk(
  'trips/removeTrip',
  async (tripId: string) => {
    await deleteTrip(tripId);
    return tripId;
  }
);

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.trips.push(action.payload);
        state.loading = false;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create trip';
      })
      .addCase(fetchUserTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTrips.fulfilled, (state, action) => {
        state.trips = action.payload as Trip[];
        state.loading = false;
      })
      .addCase(fetchUserTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      .addCase(removeTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter(trip => trip.id !== action.payload);
      });
  }
});

export default tripSlice.reducer;
