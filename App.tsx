// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator, MainNavigator } from "./Navigator";
import { AuthContext } from "./auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./utils"; // Import your utils module
import { UserContext, UserProps } from "./UserContext";
import { isMobile } from "react-device-detect";

const App: React.FC = () => {
  const discordInviteLink = "https://discord.com/invite/qcsCKat7zS";
  const [userData, setUserData] = React.useState<UserProps>({
    username: "",
    displayName: "",
    avatarUrl: "",
    email: "",
    tempUser: false,
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

  return isMobile ? (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <UserContext.Provider value={userData}>
        <NavigationContainer>
          {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </UserContext.Provider>
    </AuthContext.Provider>
  ) : (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>This app is intended for mobile devices.</h1>
      <p>
        Please open your browser's developer tools and enable the mobile view.
      </p>
      <p>
        For info:
        <br />
        <a href={discordInviteLink} target="_blank" rel="noopener noreferrer">
          Discord
        </a>
      </p>
    </div>
  );
};

export default App;
