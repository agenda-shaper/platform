// UserPage.tsx
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import utils from "./utils"; // Import your utils
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import MiniCell from "./MiniCell";
import { CellProps } from "./Cell";

const SavedRoute = () => {
  const [savedCells, setSavedCells] = useState<CellProps[]>([]);

  const fetchSavedCells = async () => {
    const res = await utils.get("/users/fetch_saved");
    if (res.status === 200) {
      const data = await res.json();
      setSavedCells(data.saved_cells);
    }
  };
  useEffect(() => {
    fetchSavedCells();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {savedCells.map((cell) => (
        <MiniCell key={cell.id} cell={cell} />
      ))}
    </ScrollView>
  );
};

const UploadedRoute = () => {
  const [uploadedCells, setUploadedCells] = useState<CellProps[]>([]);

  const fetchUploadedCells = async () => {
    const res = await utils.get("/users/fetch_uploaded");
    if (res.status === 200) {
      const data = await res.json();
      setUploadedCells(data.saved_cells);
    }
  };
  useEffect(() => {
    fetchUploadedCells();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {uploadedCells.map((cell) => (
        <MiniCell key={cell.id} cell={cell} />
      ))}
    </ScrollView>
  );
};
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
    // { key: "uploaded", title: "Uploaded Posts" },
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
            indicatorStyle={{ backgroundColor: "black" }} // Black indicator for the active tab
            style={{ backgroundColor: "white" }}
            labelStyle={{ color: "black" }}
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
