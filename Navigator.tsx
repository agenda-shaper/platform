// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";
import MainScreen from "./MainScreen"; // Import your MainScreen component
import LoginPage from "./LoginPage"; // Import your LoginPage component
import RegisterPage from "./RegisterPage"; // Import your RegisterPage component

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator(); // Create a new Stack Navigator

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Add more screens here for your navigation */}
    </Tab.Navigator>
  );
};
export { AuthNavigator, MainNavigator };
