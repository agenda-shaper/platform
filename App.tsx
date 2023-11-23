// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  AuthNavigator,
  MobileMainNavigator,
  DesktopMainNavigator,
} from "./Navigation/Navigator";
import { AuthContext } from "./Auth/auth-context";
import { View, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./Misc/utils"; // Import your utils module
import { UserContext, UserProps } from "./User/UserContext";
import { isMobile } from "react-device-detect";
import { NavigationContainerRef } from "@react-navigation/native";
import { MainTabParamList } from "./Navigation/navigationTypes";
import TopBar from "./Misc/DesktopTopbar";
import HomePage from "./Components/HomePage";

export const navigationRef =
  React.createRef<NavigationContainerRef<MainTabParamList>>();

const App: React.FC = () => {
  const discordInviteLink = "https://discord.com/invite/qcsCKat7zS";
  const [userData, setUserData] = React.useState<UserProps>({
    user_id: "",
    username: "",
    displayName: "",
    avatarUrl: "",
    email: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const tempRegister = async () => {
    console.log("temp registering");
    // no token so not logged in
    // register with temp account
    const payload = { action: "temp_register" };

    const response = await utils.auth(payload);
    if (response.status === 200) {
      // update token
      const data = await response.json();
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("tempUser", "true");
      setIsLoggedIn(true);
      setUserData(data.userData);
    } else {
      console.error(await response.json());
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log(token);

        if (token) {
          // Check if the token is valid

          // get request always includes token from storage
          const response = await utils.get("/users/auth");
          if (response.status === 200) {
            // update token
            const data = await response.json();
            await AsyncStorage.setItem("token", data.token);
            setIsLoggedIn(true);
            setUserData(data.userData);
          } else {
            console.error(await response.json());
          }
        } else {
          await tempRegister();
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <UserContext.Provider value={userData}>
        <NavigationContainer ref={navigationRef}>
          {isMobile ? (
            <MobileMainNavigator navigationRef={navigationRef} />
          ) : (
            <DesktopMainNavigator navigationRef={navigationRef} />
          )}
        </NavigationContainer>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
