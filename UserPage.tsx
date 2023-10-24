// UserPage.tsx
import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { View, Text, Image, Button, StyleSheet } from "react-native";

const UserPage: React.FC = () => {
  const { username, displayName, avatarUrl } = useContext(UserContext);
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.displayName}>{displayName}</Text>
      <Text style={styles.username}>@{username}</Text>
      <View style={styles.buttonsContainer}>
        <Button title="History" onPress={() => {}} />
        <Button title="Saved Posts" onPress={() => {}} />
        <Button title="Uploaded Posts" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    backgroundColor: "white",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  displayName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
});

export default UserPage;
