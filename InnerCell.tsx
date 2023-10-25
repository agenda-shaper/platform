import React, { useEffect, useRef } from "react";
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
import { InteractionManager } from "./utils";
import { CellProps } from "./Cell";
import { MainStackParamList } from "./navigationTypes";

// Define a new type for your route prop
type InnerCellRouteProp = RouteProp<MainStackParamList, "InnerCell">;

// Add the new route prop to your component props
type Props = {
  route: InnerCellRouteProp;
};
const InnerCell: React.FC<Props> = ({ route }) => {
  const { cell, source } = route.params;
  const {
    title,
    description,
    imageUrl,
    id,
    full_explanation,
    links,
    created_at,
  } = cell;

  const navigation = useNavigation();
  const interactionManager = InteractionManager.getInstance();
  const startTimeRef = useRef<number | null>(null);
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
          id,
          type: "innercell_visibility",
          data: { visible_ms: timeSpent, source: source },
        });
        console.log(`User spent ${timeSpent} ms on inner cell ${id}`);
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.fullExplanation}>{full_explanation}</Text>
        {links &&
          links.map((link: string, index: any) => (
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  fullExplanation: {
    fontSize: 16,
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
