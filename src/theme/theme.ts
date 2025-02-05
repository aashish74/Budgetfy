export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#add8e6',
    secondary: '#f0f8ff',
    card: '#f0f8ff',
    border: '#EEEEEE',
    error: '#FF4444',
    success: '#32CD32',
    grey: '#666666',
    lightGrey: '#999999',
  },
};

export const darkTheme = {
  colors: {
    background: '#121212',
    text: '#FFFFFF',
    primary: '#1E88E5',
    secondary: '#1F1F1F',
    card: '#2D2D2D',
    border: '#333333',
    error: '#CF6679',
    success: '#4CAF50',
    grey: '#BBBBBB',
    lightGrey: '#888888',
  },
};

export type Theme = typeof lightTheme; 