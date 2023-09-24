import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "./ChatScreen"; // Create this screen component

const Tab = createBottomTabNavigator();

const Navigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Add more screens here for your navigation */}
    </Tab.Navigator>
  );
};

export default Navigator;
