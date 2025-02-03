import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  isDark: Appearance.getColorScheme() === 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isDark = action.payload === 'system' 
        ? Appearance.getColorScheme() === 'dark'
        : action.payload === 'dark';
      // Persist theme preference
      AsyncStorage.setItem('themeMode', action.payload);
    },
    updateSystemTheme: (state) => {
      if (state.mode === 'system') {
        state.isDark = Appearance.getColorScheme() === 'dark';
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer; 