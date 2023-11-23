// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";
import UserPage from "./UserPage";
import HomePage from "./HomePage"; // Import your MainScreen component
import LoginPage from "./LoginPage"; // Import your LoginPage component
import RegisterPage from "./RegisterPage"; // Import your RegisterPage component
import InnerCell, { Props } from "./InnerCell";
import CreatePost from "./CreatePost";
import { Linking } from "react-native";

import Cell, { CellProps } from "./Cell"; // Import your Cell component
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  MainStackParamList,
  UserStackParamList,
  MainTabParamList,
  AuthStackParamList,
  MainStackNavigationProp,
  MainTabNavigationProp,
  DesktopNavigationProp,
  DesktopParamList,
} from "./navigationTypes";

const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>(); // Create a new Stack Navigator
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackScreen: React.FC = () => {
  return (
    <MainStack.Navigator initialRouteName="Main">
      <MainStack.Screen
        name="Main"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="InnerCell"
        component={(props: Props) => <InnerCell {...props} />}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Users"
        component={UserPage}
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

const UserStackScreen: React.FC<{ passed_user_id?: string }> = ({
  passed_user_id,
}) => {
  return (
    <UserStack.Navigator initialRouteName="UserPage">
      <UserStack.Screen
        name="UserPage"
        component={UserPage}
        options={{ headerShown: false }}
      />
      <UserStack.Screen
        name="InnerCell"
        component={(props: Props) => <InnerCell {...props} />}
        options={{ headerShown: false }}
      />
      <UserStack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
    </UserStack.Navigator>
  );
};

const MobileMainNavigator: React.FC<{ navigationRef: any }> = ({
  navigationRef,
}) => {
  // Get the initial URL
  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl) {
      // Create a new URL object
      const url = new URL(initialUrl);

      // Log the path
      console.log("Path: ", url.pathname);
      navigate(url.pathname);
    }
  });
  function navigate(url_path: string) {
    // Split the path by "/"
    const pathParts = url_path.split("/");

    switch (pathParts[1].toLowerCase()) {
      case "posts":
        const post_id = pathParts[2];
        if (post_id) {
          navigationRef.current?.navigate("InnerCell", { post_id });
        }

        break;
      case "users":
        const user_id = pathParts[2];
        if (user_id) {
          console.log("user", user_id);
          navigationRef.current?.navigate("Users", {
            passed_user_id: user_id,
          });
        }
        break;
      case "chat":
        navigationRef.current?.navigate("Chat");
        break;
      default:
        break;
    }
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="User" component={UserStackScreen} />
    </Tab.Navigator>
  );
};

const DesktopStack = createStackNavigator<DesktopParamList>();

const DesktopMainNavigator: React.FC<{ navigationRef: any }> = ({
  navigationRef,
}) => {
  // Get the initial URL
  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl) {
      // Create a new URL object
      const url = new URL(initialUrl);

      // Log the path
      console.log("Path: ", url.pathname);
      navigate(url.pathname);
    }
  });
  function navigate(url_path: string) {
    // Split the path by "/"
    const pathParts = url_path.split("/");

    switch (pathParts[1].toLowerCase()) {
      case "posts":
        const post_id = pathParts[2];
        if (post_id) {
          navigationRef.current?.navigate("InnerCell", { post_id });
        }

        break;
      case "users":
        const user_id = pathParts[2];
        if (user_id) {
          console.log("user", user_id);
          navigationRef.current?.navigate("Users", {
            passed_user_id: user_id,
          });
        }
        break;
      case "chat":
        navigationRef.current?.navigate("Chat");
        break;
      default:
        break;
    }
  }

  return (
    <DesktopStack.Navigator>
      <DesktopStack.Screen name="Home" component={MainStackScreen} />
      {/* /<DesktopStack.Screen name="Chat" component={ChatScreen} /> */}
      <DesktopStack.Screen name="User" component={UserStackScreen} />
    </DesktopStack.Navigator>
  );
};

export { AuthNavigator, MobileMainNavigator, DesktopMainNavigator };
