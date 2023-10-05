// navigationTypes.ts

import { StackNavigationProp } from "@react-navigation/stack";

// Define a type for your navigation structure
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Chat: undefined;
  // Add more screens as needed
};

// Define a type for the navigation prop
export type NavigationProp = StackNavigationProp<RootStackParamList>;
