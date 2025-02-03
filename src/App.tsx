import { Appearance, StatusBar } from 'react-native';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setThemeMode, updateSystemTheme } from './store/themeSlice';
import { useTheme } from './hooks/useTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme } from './theme/theme';

export default function App() {
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    // Load saved theme preference
    AsyncStorage.getItem('themeMode').then(savedMode => {
      if (savedMode) {
        dispatch(setThemeMode(savedMode as ThemeMode));
      }
    });

    const subscription = Appearance.addChangeListener(() => {
      dispatch(updateSystemTheme());
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar 
        barStyle={theme === darkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {/* Rest of your app */}
    </>
  );
} 