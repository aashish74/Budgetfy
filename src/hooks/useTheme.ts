import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { lightTheme, darkTheme } from '../theme/theme';

export const useTheme = () => {
  const { isDark } = useSelector((state: RootState) => state.theme);
  return isDark ? darkTheme : lightTheme;
}; 