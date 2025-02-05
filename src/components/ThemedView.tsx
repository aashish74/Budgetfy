import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View style={[{ backgroundColor: theme.colors.background }, style]}>
      {children}
    </View>
  );
}; 