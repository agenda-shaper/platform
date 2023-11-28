import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator } from "../Navigation/Navigator";
import { AuthContext } from "../Auth/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./utils"; // Import your utils module
import { UserContext, UserProps } from "./Contexts";
import { isMobile } from "react-device-detect";
import { NavigationContainerRef } from "@react-navigation/native";
import { MainTabParamList } from "../Navigation/navigationTypes";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useNavigation
import { MainStackNavigationProp } from "../Navigation/navigationTypes";
const gateLogo = require("../assets/gate_ai_logo.png");

const TopBar: React.FC = React.memo(() => {
  const { avatarUrl } = useContext(UserContext); // Get the user image from the UserContext
  const navigation = useNavigation<MainStackNavigationProp>();

  const handleProfileClick = () => {
    console.log("Profile clicked");
    navigation.navigate("Users", {});
  };
  const handleLogoClick = () => {
    console.log("Logo clicked");
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogoClick}>
        <Image source={gateLogo} style={styles.logoImage} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfileClick}>
        <Image
          source={{
            uri: avatarUrl,
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    // position: "absolute", // Add this line

    // top: 0, // Add this line
    // left: 0, // Add this line
    // right: 0, // Add this line
    height: 60, // Set the height of the top bar
    backgroundColor: "#f8f8f8", // Set the background color of the top bar
    width: "100%", // Make the container span the entire width
    flexDirection: "row", // Set main-axis to horizontal (left to right)
    justifyContent: "space-between", // Distribute children evenly along the main-axis
    alignItems: "center", // Align children along the cross-axis (vertically)
    paddingHorizontal: 30, // Add horizontal padding
    zIndex: 1, // Ensure the TopBar stays on top
  },
  profileImage: {
    borderRadius: 20, // Make the profile image circular
    width: 35, // Set the width of the profile image
    height: 35, // Set the height of the profile image
  },
  logoImage: {
    borderRadius: 35, // Make the profile image circular
    width: 35, // Set the width of the profile image
    height: 35, // Set the height of the profile image
  },
});

export default TopBar;
