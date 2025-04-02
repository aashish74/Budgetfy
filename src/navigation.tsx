import { Image, StatusBar} from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AddExpensesScreen from './screens/AddExpensesScreen';
import IMAGES from './assets/images';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TripExpensesScreen from './screens/TripExpensesScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser } from './store/userSlice';
import { AppDispatch, RootState } from './store/store';
import { serializeUser } from './store/userSerializer';
import { setTrips } from './store/tripSlice';
import CurrencyScreen from './screens/CurrencyScreen';
import { useTheme } from './hooks/useTheme';
import { darkTheme } from './theme/theme';
import StatisticsScreen from './screens/StatisticsScreen';
import HelpScreen from './screens/HelpScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image 
              source={IMAGES.HOME} 
              style={{ 
                height: 24, 
                width: 24, 
                tintColor: focused ? theme.colors.primary : theme.colors.grey 
              }} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image 
              source={IMAGES.PLUS} 
              style={{ 
                height: 28, 
                width: 28, 
                tintColor: focused ? theme.colors.primary : theme.colors.grey 
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image 
              source={IMAGES.BOTTOMPROFILE} 
              style={{ 
                height: 24, 
                width: 24, 
                tintColor: focused ? theme.colors.primary : theme.colors.grey 
              }} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const theme = useTheme();
  const { mode } = useSelector((state: RootState) => state.theme);
  
  const navigationTheme = {
    dark: mode === 'dark',
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (firebaseUser) => {
      if (firebaseUser) {
        const serializedUser = serializeUser(firebaseUser);
        dispatch(setUser(serializedUser));
      } else {
        dispatch(clearUser());
        dispatch(setTrips([]));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar 
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={mode === 'dark' ? '#000000' : '#ffffff'}
        translucent
      />
      <Stack.Navigator initialRouteName={user ? 'MainTabs' : 'Welcome'}>
        {!user ? (
          <>
            <Stack.Screen name='Welcome' component={WelcomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name='SignUp' component={SignUpScreen} options={{headerShown: false}}/>
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="TripExpenses" component={TripExpensesScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="AddExpenses" component={AddExpensesScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Currency" component={CurrencyScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Statistics' component={StatisticsScreen} options={{headerShown:false}}/>
            <Stack.Screen name='Help' component={HelpScreen} options={{headerShown:false}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;