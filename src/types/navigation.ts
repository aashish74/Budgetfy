export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Expenses: undefined;
  Settings: undefined;
  ExpensesMain: undefined;
  MainTabs: undefined;
  TripExpenses: {
    place: string;
    country: string;
    id: string;
  }; 
  AddExpenses: {
    tripId: string;
  };
};