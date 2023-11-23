// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../Components/ChatScreen";

import DesktopChat from "../Components/DesktopChat";
import UserPage from "../User/UserPage";
import HomePage from "../Components/HomePage"; // Import your MainScreen component
import LoginPage from "../Auth/LoginPage"; // Import your LoginPage component
import RegisterPage from "../Auth/RegisterPage"; // Import your RegisterPage component
import InnerCell, { Props } from "../Posts/InnerCell";
import CreatePost from "../User/CreatePost";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

import { Linking } from "react-native";
import TopBar from "../Misc/DesktopTopbar";
import Cell, { CellProps } from "../Posts/Cell"; // Import your Cell component
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  MainStackParamList,
  UserStackParamList,
  MainTabParamList,
  AuthStackParamList,
  MainStackNavigationProp,
  MainTabNavigationProp,
} from "./navigationTypes";
import { post } from "../Misc/utils";

const Tab = createBottomTabNavigator<MainTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>(); // Create a new Stack Navigator
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackScreen: React.FC = () => {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        name="Home"
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
    <UserStack.Navigator initialRouteName="User">
      <UserStack.Screen
        name="User"
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
      navigateUrl(url.pathname, navigationRef);
    }
  });

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MainStackScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="User" component={UserStackScreen} />
    </Tab.Navigator>
  );
};

const DesktopStack = createStackNavigator<MainStackParamList>();

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
      navigateUrl(url.pathname, navigationRef);
    }
  });

  return (
    <>
      <View style={{ flex: 1 }}>
        <TopBar />

        <DesktopStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Home"
        >
          <DesktopStack.Screen name="Home" component={MainStackScreen} />
          {/* /<DesktopStack.Screen name="Chat" component={ChatScreen} /> */}
          <DesktopStack.Screen name="Users" component={UserStackScreen} />
        </DesktopStack.Navigator>
      </View>
      <DesktopChat />
    </>
  );
};
function navigateUrl(url_path: string, navigationRef: any) {
  // Split the path by "/"
  const pathParts = url_path.split("/");
  console.log("should be navigating: ", pathParts);

  switch (pathParts[1].toLowerCase()) {
    case "posts":
      const post_id = pathParts[2];
      console.log(pathParts);
      if (post_id) {
        console.log("posts: ", post_id);
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
export { AuthNavigator, MobileMainNavigator, DesktopMainNavigator };
