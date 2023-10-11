import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// Define a type for your authentication stack navigation structure
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  // Add more authentication screens as needed
};

// Define a type for the navigation prop within the authentication stack navigator
export type AuthNavigationProp = StackNavigationProp<AuthStackParamList>;

// Define a type for your main tab navigation structure
export type MainTabParamList = {
  Main: undefined;
  Chat: undefined;
  // Add more tab screens here for your navigation
};

// Define a type for the navigation prop within the main tab navigator
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
