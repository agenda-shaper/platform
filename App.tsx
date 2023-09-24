import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./Navigator"; // Import your navigation component

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

export default App;
