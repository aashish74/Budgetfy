import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from '../store/themeSlice';
import { RootState } from '../store/store';
import { useTheme } from '../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state: RootState) => state.theme);
  const theme = useTheme();

  const toggleTheme = () => {
    dispatch(setThemeMode(mode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[styles.container, { backgroundColor: theme.colors.card }]}
    >
      <Icon 
        name={mode === 'dark' ? 'light-mode' : 'dark-mode'} 
        size={24} 
        color={theme.colors.text} 
      />
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  text: {
    marginLeft: 8,
    fontSize: 16,
  },
}); 