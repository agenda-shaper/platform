// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  AuthNavigator,
  MobileMainNavigator,
  DesktopMainNavigator,
} from "./Navigation/Navigator";
import { AuthContext } from "./Auth/auth-context";
import { View, ScrollView, SafeAreaView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./Misc/utils"; // Import your utils module
import { UserContext, UserProps, ChatContext } from "./Misc/Contexts";
import { isMobile } from "react-device-detect";
import { NavigationContainerRef } from "@react-navigation/native";
import { MainTabParamList } from "./Navigation/navigationTypes";
import TopBar from "./Misc/DesktopTopbar";
import HomePage from "./Components/HomePage";
import { CellProps } from "./Posts/Cell";
declare global {
  interface Window {
    __CELL_DATA__: CellProps | undefined;
    __USER_DATA__: UserProps | undefined;
  }
}
export const navigationRef =
  React.createRef<NavigationContainerRef<MainTabParamList>>();

const App: React.FC = () => {
  const discordInviteLink = "https://discord.com/invite/qcsCKat7zS";
  const [chatData, setChatData] = React.useState<CellProps | undefined>();

  const [userData, setUserData] = React.useState<UserProps>({
    user_id: "",
    username: "",
    displayName: "",
    avatarUrl: "",
    email: "",
  });
  const isMobileOS = Platform.OS === 'ios' || Platform.OS === 'android' || isMobile;
  console.log("ismobile os", isMobile);

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
        <ChatContext.Provider value={{ chatData, setChatData }}>
          <NavigationContainer ref={navigationRef}>
            {isMobileOS ? (
              <MobileMainNavigator navigationRef={navigationRef} />
            ) : (
              <DesktopMainNavigator navigationRef={navigationRef} />
            )}
          </NavigationContainer>
        </ChatContext.Provider>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
