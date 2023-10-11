// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, MainNavigator } from "./Navigator";
import { AuthContext } from "./auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./utils"; // Import your utils module

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          // Check if the token is valid

          // get request always includes token from storage
          const response = await utils.get("/users/auth");
          if (response.status === 200) {
            // update token
            const data = await response.json();
            await AsyncStorage.setItem("token", data.token);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
