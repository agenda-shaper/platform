// Navigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen";
import MainScreen from "./MainScreen"; // Import your MainScreen component
import LoginPage from "./LoginPage"; // Import your LoginPage component

const Tab = createBottomTabNavigator();

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Login" component={LoginPage} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Add more screens here for your navigation */}
    </Tab.Navigator>
  );
};

export default Navigator;
