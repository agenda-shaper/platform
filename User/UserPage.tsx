// UserPage.tsx
import React, { useContext, useState, useEffect } from "react";
import { UserContext, UserProps } from "./UserContext";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import utils from "../Misc/utils"; // Import your utils
import {
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { UserStackNavigationProp } from "../Navigation/navigationTypes";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import MiniCell from "../Posts/MiniCell";
import { CellProps } from "../Posts/Cell";
import {
  MainStackParamList,
  MainStackNavigationProp,
  MainTabNavigationProp,
} from "../Navigation/navigationTypes";

const SavedRoute = () => {
  const [savedCells, setSavedCells] = useState<CellProps[]>([]);

  const fetchSavedCells = async () => {
    const res = await utils.get("/users/fetch_saved");
    if (res.status === 200) {
      const data = await res.json();
      if (data.cells.length > 0) {
        setSavedCells(data.cells);
      }
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
      if (data.cells.length > 0) {
        setUploadedCells(data.cells);
      }
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
const fetchUserInfo = async (user_id: string) => {
  console.log("fetching info");
  const response = await utils.post("/users/load_info", { user_id });
  const data = await response.json();
  console.log(data);
  return data.userData;
};
const PublicUserRoute = (
  navigation: UserStackNavigationProp,
  passed_user_id: string
) => {
  console.log("public user route");
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "web") {
        // Change the URL without causing a navigation event
        window.history.pushState(null, "", `/users/${passed_user_id}`);
      }
    }, [])
  );
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "uploaded", title: "Uploaded Posts" },
  ]);
  useEffect(() => {
    console.log("fetching");
    if (!userInfo) {
      fetchUserInfo(passed_user_id).then((data) => {
        console.log(data);
        setUserInfo(data);
      });
    }
  }, []);
  if (!userInfo) {
    return null; // Don't render anything while loading
  }
  navigation.setOptions({ title: userInfo.displayName });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={{ uri: userInfo.avatarUrl }} style={styles.avatar} />
        <Text style={styles.displayName}>{userInfo.displayName}</Text>
        <Text style={styles.username}>@{userInfo.username}</Text>
      </View>
      {/* <TabView
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
      /> */}
    </View>
  );
};

const SelfUserRoute = (navigation: UserStackNavigationProp) => {
  console.log("self route");
  const { user_id, username, displayName, avatarUrl } = useContext(UserContext);
  navigation.setOptions({ title: displayName });

  console.log(user_id, username, displayName, avatarUrl, "STUFF");
  const [index, setIndex] = React.useState(0);
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "web") {
        // Change the URL without causing a navigation event
        window.history.pushState(null, "", `/users/${user_id}`);
      }
    }, [])
  );

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
        <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
          <Text style={styles.createButton}>Create</Text>
        </TouchableOpacity>
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

const initialLayout = { width: Dimensions.get("window").width };

// Define a new type for your route prop
type UserRouteProp = RouteProp<MainStackParamList, "Users">;

// Add the new route prop to your component props
export type UserRouteProps = {
  route?: UserRouteProp;
};
const UserPage: React.FC<UserRouteProps> = ({ route }) => {
  let passed_user_id = undefined;
  if (route) {
    passed_user_id = route.params?.passed_user_id;
  }

  console.log("passed_user_id: ", passed_user_id);
  const navigation = useNavigation<UserStackNavigationProp>();
  console.log("checking");

  if (passed_user_id) {
    return PublicUserRoute(navigation, passed_user_id);
  } else {
    console.log("SelfUserRoute");
    return SelfUserRoute(navigation);
  }
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    fontSize: 18,
    color: "black", // changing color to black
    borderWidth: 1, // adding an outline
    borderRadius: 8, // smoothing corners
    borderColor: "black", // setting the border color to black
    paddingHorizontal: 12, // optional padding for better appearance
    paddingVertical: 6, // optional padding for better appearance
    marginBottom: 8, // optional margin for spacing
    textAlign: "center", // center the text inside the button
    //fontFamily: "font-used-in-SavedPosts-field", // applying the same font used in "Saved Posts"
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
