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
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { CellProps } from "./Cell";
import {
  MainStackParamList,
  MainStackNavigationProp,
  MainTabNavigationProp,
} from "./navigationTypes";
import utils, { InteractionManager } from "./utils"; // Import your utility module

// Define a new type for your route prop
type InnerCellRouteProp = RouteProp<MainStackParamList, "InnerCell">;

// Add the new route prop to your component props
type Props = {
  route: InnerCellRouteProp;
};
const InnerCell: React.FC<Props> = ({ route }) => {
  const { cell: cellProp, post_id } = route.params;
  const source = !route.params.source ? "web" : route.params.source;
  const [cell, setCell] = useState(cellProp);

  const fetchCellData = async () => {
    const response = await utils.get(`/cells/${post_id}`);
    const data = await response.json();
    setCell(data.cell);
  };
  const navigation = useNavigation<MainStackNavigationProp>();

  const interactionManager = InteractionManager.getInstance();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!cell && post_id) {
      fetchCellData();
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

const styles = StyleSheet.create({
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

export default InnerCell;
