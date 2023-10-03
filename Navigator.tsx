// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen";
import MainScreen from "./MainScreen"; // Import your MainScreen component
import LoginPage from "./LoginPage"; // Import your LoginPage component
import RegisterPage from "./RegisterPage"; // Import your RegisterPage component

const Tab = createBottomTabNavigator();

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={LoginPage} />
      <Tab.Screen name="Main" component={MainScreen} />

      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Register" component={RegisterPage} />

      {/* Add more screens here for your navigation */}
    </Tab.Navigator>
  );
};

export default Navigator;
