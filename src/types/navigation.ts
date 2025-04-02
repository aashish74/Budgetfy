export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  Home: undefined;
  Profile: undefined;
  TripExpenses: {
    place: string;
    country: string;
    id: string;
  };
  Currency: undefined;
  Statistics: undefined;
  Help: undefined;
};


export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};