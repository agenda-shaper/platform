// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";
import UserPage from "./UserPage";
import MainScreen from "./MainScreen"; // Import your MainScreen component
import LoginPage from "./LoginPage"; // Import your LoginPage component
import RegisterPage from "./RegisterPage"; // Import your RegisterPage component
import InnerCell from "./InnerCell"; // Import your RegisterPage component
import Cell, { CellProps } from "./Cell"; // Import your Cell component
import { NavigationContainer } from "@react-navigation/native";
import {
  MainStackParamList,
  UserStackParamList,
  MainTabParamList,
  AuthStackParamList,
} from "./navigationTypes";
const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>(); // Create a new Stack Navigator
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackScreen: React.FC = () => {
  return (
    <MainStack.Navigator initialRouteName="Main">
      <MainStack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="InnerCell"
        component={InnerCell}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginPage} />
      <AuthStack.Screen name="Register" component={RegisterPage} />
    </AuthStack.Navigator>
  );
};
const UserStack = createStackNavigator<UserStackParamList>();

const UserStackScreen: React.FC = () => {
  return (
    <UserStack.Navigator initialRouteName="UserPage">
      <UserStack.Screen
        name="UserPage"
        component={UserPage}
        options={{ headerShown: false }}
      />
      <UserStack.Screen
        name="InnerCell"
        component={InnerCell}
        options={{ headerShown: false }}
      />
    </UserStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="User" component={UserStackScreen} />
    </Tab.Navigator>
  );
};

export { AuthNavigator, MainNavigator };
