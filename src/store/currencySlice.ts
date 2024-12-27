import { createSlice, PayloadAction} from "@reduxjs/toolkit";

export type CurrencyType = {
    symbol:string;
    id:string;
    rate:number;
}

interface currencyState{
    currency: CurrencyType;
}

const initialState: currencyState = {
    currency : {symbol: '₹', id: 'INR', rate:1},
}

export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers:{
        setCurrency: (state, action: PayloadAction<CurrencyType>)=>{
            state.currency = action.payload;
        }
    }
})

export default currencySlice.reducer;
export const {setCurrency} = currencySlice.actions;