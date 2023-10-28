// navigationTypes.ts
import { StackNavigationProp } from "@react-navigation/stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CellProps } from "./Cell"; // Import your Cell component
import { UserProps } from "./UserContext"; // Import your Cell component

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
  Home: undefined;
  Chat: undefined;
  User: undefined;
  // Add more tab screens here for your navigation
};
// Define a type for the navigation prop within the main tab navigator
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;

export type MainStackParamList = {
  Main: undefined;
  Screen: { InnerCell: undefined };
  InnerCell: { cell: CellProps; source: string };
};

export type UserStackParamList = {
  UserPage: undefined;
  InnerCell: { cell: CellProps; source: string };
};

export type UserStackNavigationProp = StackNavigationProp<UserStackParamList>;

export type MainStackNavigationProp = StackNavigationProp<MainStackParamList>;
