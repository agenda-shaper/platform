// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  AuthNavigator,
  MobileMainNavigator,
  DesktopMainNavigator,
} from "./Navigator";
import { AuthContext } from "./auth-context";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./utils"; // Import your utils module
import { UserContext, UserProps } from "./UserContext";
import { isMobile } from "react-device-detect";
import { NavigationContainerRef } from "@react-navigation/native";
import { MainTabParamList, DesktopParamList } from "./navigationTypes";
import TopBar from "./DesktopTopbar";
import HomePage from "./HomePage";

export const mobileNavigationRef =
  React.createRef<NavigationContainerRef<MainTabParamList>>();
export const desktopNavigationRef =
  React.createRef<NavigationContainerRef<DesktopParamList>>();

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
        {isMobile ? (
          <NavigationContainer>
            {/* {isLoggedIn ? <MainNavigator /> : <AuthNavigator />} */}
            <MobileMainNavigator navigationRef={mobileNavigationRef} />
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <View style={{ flex: 1 }}>
              <TopBar />
              <View style={{ flex: 1 }}>
                <DesktopMainNavigator navigationRef={desktopNavigationRef} />
              </View>
            </View>
          </NavigationContainer>
        )}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
