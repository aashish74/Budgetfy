import { View, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ThemedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ThemedCard: React.FC<ThemedViewProps> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <View 
      style={[
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          shadowColor: theme.colors.text,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}; 