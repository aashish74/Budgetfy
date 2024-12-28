import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    userLoading: false
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setUser: (state, action) =>{
        state.user = action.payload
    },
    setUserLoading: (state, action) =>{
        state.userLoading = action.payload
    },
  },
})

export const { setUser, setUserLoading } = userSlice.actions;
export default userSlice.reducer;