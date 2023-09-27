// Navigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen";
import MainScreen from "./MainScreen"; // Import your MainScreen component

const Tab = createBottomTabNavigator();

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Main" component={MainScreen} />
      {/* Add the MainScreen here */}
      {/* Add more screens here for your navigation */}
    </Tab.Navigator>
  );
};

export default Navigator;
