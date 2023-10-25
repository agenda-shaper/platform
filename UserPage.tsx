// UserPage.tsx
import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import MiniCell from "./MiniCell";

const demoCell = {
  id: "1",
  title: "Demo Title",
  description: "Demo Description",
  imageUrl: "https://via.placeholder.com/150", // Replace with your image URL
  full_explanation: "This is a full explanation of the demo cell.",
  links: ["https://example.com/link1", "https://example.com/link2"],
  created_at: new Date().toISOString(),
};

const SavedRoute = () => <MiniCell cell={demoCell} />;

const UploadedRoute = () => <MiniCell cell={demoCell} />;

const renderScene = SceneMap({
  saved: SavedRoute,
  uploaded: UploadedRoute,
});
const initialLayout = { width: Dimensions.get("window").width };

const UserPage: React.FC = () => {
  const { username, displayName, avatarUrl } = useContext(UserContext);
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "saved", title: "Saved Posts" },
    { key: "uploaded", title: "Uploaded Posts" },
  ]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.displayName}>{displayName}</Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }} // Gray indicator for the active tab
            style={{ backgroundColor: "white" }} // Transparent background
            labelStyle={{ color: "black" }} // Transparent labels
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabview: {
    flex: 1,
    width: "100%",
  },
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
