import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Currency {
  id: string;
  symbol: string;
  rate: number;
}

interface CurrencyState {
  baseCurrency: Currency;
  targetCurrency: Currency;
}

const initialState: CurrencyState = {
  baseCurrency: {
    id: 'INR',
    symbol: '₹',
    rate: 1
  },
  targetCurrency: {
    id: 'USD',
    symbol: '$',
    rate: 0.012 // This will be updated with real rates
  }
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setTargetCurrency: (state, action: PayloadAction<Currency>) => {
      state.targetCurrency = action.payload;
    },
  },
});

export const { setTargetCurrency } = currencySlice.actions;
export default currencySlice.reducer;