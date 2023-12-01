import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { CellProps } from "./Cell";
import {
  MainStackParamList,
  MainStackNavigationProp,
  MainTabNavigationProp,
} from "../Navigation/navigationTypes";
import utils, { InteractionManager } from "../Misc/utils"; // Import your utility module
import { isMobile } from "react-device-detect";


// Define a new type for your route prop
type InnerCellRouteProp = RouteProp<MainStackParamList, "InnerCell">;

// Add the new route prop to your component props
export type Props = {
  route: InnerCellRouteProp;
};
const InnerCell: React.FC<Props> = ({ route }) => {
  const { cell: cellProp } = route.params;
  const source = !route.params.source ? "web" : route.params.source;
  const post_id = !route.params.cell?.id
    ? route.params.post_id
    : route.params.cell?.id;
  const [cell, setCell] = useState(cellProp);
  const isMobileOS = Platform.OS === 'ios' || Platform.OS === 'android' || isMobile;

  const styles = isMobileOS ? mobileStyles : desktopStyles;

  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "web") {
        // Change the URL without causing a navigation event
        window.history.pushState(null, "", `/posts/${post_id}`);
      }
    }, [])
  );

  const fetchCellData = async (post_id: string) => {
    const response = await utils.post("/cells/load_info", { post_id });
    const data = await response.json();
    return data.cellData;
  };
  const navigation = useNavigation<MainStackNavigationProp>();

  const interactionManager = InteractionManager.getInstance();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!cell && post_id) {
      const html_cell = window.__CELL_DATA__;
      if (html_cell) {
        console.log("fetched cell from HTML");
        setCell(html_cell);
      } else {
        // fetch from server
        console.log("fetching cell from server");
        fetchCellData(post_id).then((data) => {
          setCell(data);
        });
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Start the timer when the page comes into focus
      startTimeRef.current = Date.now();
      console.log("went active on inner cell");
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Stop the timer and log the time spent on the page when it goes out of focus
      if (startTimeRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        interactionManager.add({
          post_id: cell?.id || post_id || "0",
          type: "innercell_visibility",
          data: { visible_ms: timeSpent, source: source },
        });
        console.log(
          `User spent ${timeSpent} ms on inner cell ${
            cell?.id || post_id || "0"
          }`
        );
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);

  if (!cell) {
    return null; // Don't render anything while loading
  }
  navigation.setOptions({ title: cell.title });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{cell.title}</Text>
        <Text style={styles.fullExplanation}>{cell.full_explanation}</Text>
        {cell.links &&
          cell.links.map((link: string, index: any) => (
            <Text
              key={index}
              style={styles.link}
              onPress={() => Linking.openURL(link)}
            >
              {link}
            </Text>
          ))}
      </ScrollView>
      <View style={styles.buttonsContainer}></View>
    </SafeAreaView>
  );
};

const mobileStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 18,
    marginHorizontal: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
    marginHorizontal: 4,
  },
  fullExplanation: {
    fontSize: 15,
    marginHorizontal: 6,
    //color: "#888",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});
const desktopStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "30%", // Make the list take up the full width of its container
    alignSelf: "center",
  },
  container: {
    padding: 16,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 18,
    marginHorizontal: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 18,
    alignSelf: "center",
    marginHorizontal: 4,
  },
  fullExplanation: {
    fontSize: 15,
    marginHorizontal: 6,
    //color: "#888",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default InnerCell;
