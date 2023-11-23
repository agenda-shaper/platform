import React, { useState, useEffect, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigator } from "./Navigator";
import { AuthContext } from "./auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import utils from "./utils"; // Import your utils module
import { UserContext, UserProps } from "./UserContext";
import { isMobile } from "react-device-detect";
import { NavigationContainerRef } from "@react-navigation/native";
import { MainTabParamList } from "./navigationTypes";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

const TopBar: React.FC = React.memo(() => {
  const { avatarUrl } = useContext(UserContext); // Get the user image from the UserContext

  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Here you can navigate to the profile screen or perform any other action
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfileClick}>
        <Image
          source={{
            uri: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
          }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    height: 60, // Set the height of the top bar
    backgroundColor: "#f8f8f8", // Set the background color of the top bar
    width: "100%", // Make the container span the entire width
  },
  profileImage: {
    width: 40, // Set the width of the profile image
    height: 40, // Set the height of the profile image
    borderRadius: 20, // Make the profile image circular
    alignSelf: "flex-end", // Push items to the right edge of the container
    marginRight: 30,
    marginVertical: 10,
  },
});

export default TopBar;
