import { Image, StatusBar} from 'react-native'
import React from 'react'
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon:({focused}) => (
              <Image source={IMAGES.HOME} style = {{height:30, width: 30, tintColor: focused ? 'blue': 'grey' }} />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          tabBarIcon:({focused}) => (
              <Image source={IMAGES.PLUS} style = {{height:35, width:35, tintColor: focused ? 'blue': 'grey'}}/>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon:({focused}) => (
              <Image source={IMAGES.BOTTOMPROFILE} style = {{height:30, width: 30, tintColor: focused ? 'blue': 'grey' }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Navigation = () => {
  return(
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="Transparent" />
      <Stack.Navigator initialRouteName='Profile'>
        {/* <Stack.Screen name='Welcome' component={WelcomeScreen} options={{headerShown: false}}/> */}
        {/* <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/> */}
        {/* <Stack.Screen name='SignUp' component={SignUpScreen} options={{headerShown: false}}/> */}
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="TripExpenses" component={TripExpensesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddExpenses" component={AddExpensesScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;